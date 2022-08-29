const express = require('express')
const router = express.Router()
const validator = require('../middleware/validation')
const userModel = require('../models/user')
const bcrypt = require('bcrypt');
const uploadAws = require('../middleware/awsConfig')
const aws = require("aws-sdk")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { findOne, findById } = require('../models/user');
//const { config } = require('process');
const config=require("../config/config")


const registration = async (req, res) => {
    try {
        const data = req.body

        
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data like firstname lastname" }) }    //validation for req body

        const { fname, lname, email, phone, password, address } = data

        // validation for required field
        if (!validator.isvalid(fname)) { return res.status(400).send({ status: false, massage: "Please enter first name" }) }

        if (!validator.isvalid(lname)) { return res.status(400).send({ status: false, massage: "Please enter last name" }) }

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, massage: "Please enter email" })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, massage: "Please enter correct email" })      //to check if mail id format is wrong
        }
        const emailFind = await userModel.findOne({ email: email })
        if (emailFind) {
            return res.status(400).send({ status: false, massage: "Email alrady Exist" })       //this validation to inform email id should not reapeat it should be uniqe for every user
        }


        if (!validator.isvalid(phone)) { return res.status(400).send({ status: false, massage: "Please enter phone" }) }
        if (!validator.isValidPhone(phone)) { return res.status(400).send({ status: false, massage: "Enter Correct mobile Number" }) }     //to accept only correct format phone number
        let mobileNumber = await userModel.findOne({ phone: phone })
        if (mobileNumber) { return res.status(400).send({ status: false, massage: "mobile Number alrady exist" }) }   //this validation to inform mobile number should not reapeat it should be uniqe for every user
        if (!validator.isvalid(address)) { return res.status(400).send({ status: false, massage: "Please enter address" }) }
        if (!validator.isvalid(password)) { return res.status(400).send({ status: false, massage: "Please enter password" }) }
        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, massage: "Please length should be 8 to 15 password" }) }
        const hash = bcrypt.hashSync(password, 6);        //encrypting password to secure it
        data.password = hash

        
        const profilePic = req.files
        if (profilePic && profilePic.length > 0) {

            let uploadedFileURL = await uploadAws.uploadFile(profilePic[0])      //uploading image to aws 
            data.profileImage = uploadedFileURL                                  //assigning the url to profileImage field in response
        }
        else {
            return res.status(400).send({ message: "No file found" })
        }
        const createUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const loginUser = async function (req, res) {
    try {
        const requestbody = req.body;
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. please provide login details" })        //validation for req body
        }

        const { email, password } = requestbody;

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` })         //as email is required it should not be empty
        }
        if (!validator.isValidEmail(email)) {                                                    //email format validation
            return res.status(400).send({ status: false, message: `Email is not correct ` })
        }

        if (!validator.isvalid(password)) {
            res.status(400).send({ status: false, message: `password is required` })           //password is required
            return
        }

        const user = await userModel.findOne({ email: email })                           //checking is there any user exist with this email id
        if (!user) {
            return res.status(401).send({ status: false, message: 'email is wrong' })       
        }
        const decrpted = bcrypt.compareSync(password, user.password);            //comparing req body password and password in db for that user
        if (decrpted == true) {                                                  //if both password same then only creating token for user 
            const token = await jwt.sign({
                UserId: user._id,                                                //token created with _id of user ,secrete key is "privatekey"
            }, 'privatekey', { expiresIn: "10h" })

            const abc = res.setHeader('authorization', `Bearer ${token}`);              //token set to header
            let loginstatus=await userModel.findOneAndUpdate({email:email},{status:'loggedin'})     //after user logged in his status felid making as loggedin
            return res.status(200).send({ status: true, message: 'User login successfully', data: { userId: user._id, token: token } })
        }
        else {
            res.status(400).send({ status: false, message: "password is incorrect" })
        }

    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }

}


const getUser = async (req, res) => {
    try {
        let UserId = req.params.userId.trim()       

        const u_details = await userModel.findById(UserId)
        if (!u_details) return res.status(404).send({ status: false, message: "user not found" })

        if (req.decodedToken.UserId == UserId && u_details.status=='loggedin') {      //allowing access only when userid in token and in path parameter are same as well user's status should be "loggedin"

        if (!validator.isValidObjectId(UserId)) { return res.status(400).send({ status: false, message: "Please provide valid userid" }) }
        if (req.decodedToken.UserId == UserId) {
            let newData = await userModel.findById({ _id: UserId })
            return res.status(200).send({ status: true, message: "UserProfile Data is here ", data: newData })
        } else {
            return res.status(403).send({ status: false, message: "authorization denied" })
        }
    } else {
        return res.status(403).send({ status: false, message: "authorization denied" })
    }
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}


const updateUser = async function (req, res) {
    try {
        let data = req.body
        
        let userId = req.params.userId.trim()
        let profilePic = req.files


        if (!data || !profilePic) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. please provide update details" })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter valid userId" })     
        }

        const u_details = await userModel.findById(userId)
        if (!u_details) return res.status(404).send({ status: false, message: "user not found" })




        if (req.decodedToken.UserId == userId && u_details.status=='loggedin') {          //authorization
            const { fname, lname, email, phone, password, address, } = data

            let profile = {}                                 //empty object to add all the required changes to it

            if (validator.isvalid(fname)) {
                profile['fname'] = fname
            }



            if (validator.isvalid(lname)) {
                profile['lname'] = lname
            }


            if (validator.isvalid(email)) {
                if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, massage: "email is not correct formate enter correct email id" }) }
                let emailFind = await userModel.findOne({ email: email })
                if (emailFind) { return res.status(400).send({ status: false, massage: "Email id already exist" }) }   //while updating data also we should check that email id should not repeat
                profile['email'] = email
            }


            if (validator.isvalid(phone)) {
                if (!validator.isValidPhone(phone)) { return res.status(400).send({ status: false, massage: "phone not correct enter correct phone" }) }
                let phoneFind = await userModel.findOne({ phone: phone })
                if (phoneFind) return res.status(400).send({ status: false, massage: "phone no already exist" })           //while updating data also we should check that mobile number should not repeat
                profile['phone'] = phone
            }

            if (validator.isvalid(password)) {
                if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, massage: "please length should be 8 to 15 password" }) }
                const hash = bcrypt.hashSync(password, 6);   //encrypting password 
                profile['password'] = hash
            }

            if (profilePic && profilePic.length > 0) {
                const profilePic = req.files
                let uploadedFileURL = await uploadAws.uploadFile(profilePic[0])       //profile pic uploading to aws
                profile['profileImage'] = uploadedFileURL
            }

            if (validator.isvalid(address)) {
                profile['address'] = address
            }


            
            let updated = await userModel.findOneAndUpdate({ _id: userId }, { $set: profile }, { new: true })    //$set to update the data

            return res.status(200).send({ status: true, message: "data updated successfully", data: updated })

        } else {
            return res.status(403).send({ status: false, message: "authorization denied" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deluser = async (req, res) => {
    try{
        const user_id = req.params.userId
        const user =  await userModel.findByIdAndDelete(user_id)    //finding user with this id and deleting
       
        res.status(200).json({
            status: 200,
            message: 'User deleted successfully',
            data: user
        })
    } catch (e) {
        res.status(500).send(e.message)
    }    
};

const changePassword = async (req, res) => {
    try{

        //to change the password only 

        let userId=req.params.userId
        const {username,new_password} = req.body
        let profile={}
        console.log(username)
        //console.log(current_password)
        console.log(new_password)
        let user = await userModel.findOne({email:username})

        console.log(user)
         if(!user){
            return res.status(200).json({
                status: 400,
                message: 'User not found. Please create account.'
            })
         }
         if(!new_password || new_password == ""){      //new password should not empty
            return res.status(200).json({
                status: 400,
                message: 'Password Cannot be empty.'
            })
         }

         if (req.decodedToken.UserId == userId && user.status=='loggedin') {      //authorization
         if (validator.isvalid(new_password)) {
            if (new_password.length < 8 || new_password.length > 15) { return res.status(400).send({ status: false, massage: "please length should be 8 to 15 password" }) }
            const hash = bcrypt.hashSync(new_password, 6);     //encrypting new password 
            profile['password'] = hash                         //assigning encrypted password to password feiled in profile object
        }

        
           await userModel.findByIdAndUpdate(user._id,{ $set: profile }, { new: true });       //passing profile object to set the changes or new password
            
        
        return res.status(200).json({
            'status': 200,
            'message': "Password changed successfully."
        });
    }else{
        return res.status(403).send({ status: false, message: "authorization denied" }) 
    }

    } catch (e) {
        res.status(500).send(e.message);
    } 
   };



   const sendResetPasswordMail=async(name,email,token)=>{
    try{

       const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',                         //smtp used to send mail 
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,                    //email id of sender
                pass:config.emailPassword                 //app password(setup done in google account settings)
            }
        });

        const mailOptions={
            from:config.emailUser,                    //email id of sender
            to:email,                                 //receiver's mailid
            subject:'To Reset The Password',
            html:'<p>Hii '+name+' ,Please copy the<a href="http://127.0.0.1:3000/resetPassword?token='+token+'">link</a> in Your browser and reset your password</p>'   //mail body

        }

        transporter.sendMail(mailOptions,function(error,info){     //sending mail using sendMail method of nodemailer
            if(error){
                console.log(error)
            }else{
                console.log("mail sent",info.response);
            }
        });

    }catch(e){

    }
   }



   const forgotPassword=async(req,res)=>{
       
    try{
        const email=req.body.email
        const userData=await userModel.findOne({email:email});  //checking whether user exist with req body email
        
        if(userData){
           const randomString= randomstring.generate()        //random string generated for unique token 
           let data=await userModel.updateOne({email:email},{$set:{token:randomString}})    //setting the generated random string to token field
           sendResetPasswordMail(userData.fname,userData.email,randomString);            //sending mail to user with reset password link
           res.status(200).send({message:"We have sent you a link to reset the password Please check your mail inbox and reset your password"})
        }else{
            return res.status(404).send({message:"This mail does not exists"}) 
        }


    }catch(e){
        return res.status(500).send(e.message);
    }
   }


   const resetPassword=async(req,res)=>{
    try{
        const token =req.query.token;
        const tokenData=await userModel.findOne({token:token});    //checking token is present for user or not

        if(tokenData){
            const password=req.body.password
            const newPassword=bcrypt.hashSync(password, 6)   //encrypting new password
            const userData=await userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true})    //updating new password and setting token as empty string 
            res.status(200).send({success:true,msg:"Password successfully updated",data:userData})
        }else{
            return res.status(400).send({message:"This has been expired"})
        }

    }catch(err){
        return res.status(500).send(err.message);
    }
   }

   const logout=async(req,res)=>{
    try{
        let userId=req.params.userId
        let user=await userModel.findById(userId)

        if(!user){
            return res.status(404).send({ status: false, message: "User Not Found" })
        }

        if (req.decodedToken.UserId == userId && user.status=='loggedin') {
         let loggedout=await userModel.findByIdAndUpdate(userId,{status:'loggedout'})   //as user wants to log out hence making status as loggedout for that user

         return res.status(200).send({msg:"Logged Out succesfully"})

        }else{
            return res.status(403).send({ status: false, message: "authorization denied" })
        }
       }catch(e){
       return res.status(500).send(e.message);
    }
   }


module.exports.registration = registration
module.exports.loginUser = loginUser
module.exports.getUser = getUser
module.exports.updateUser = updateUser
module.exports.deluser=deluser
module.exports.changePassword=changePassword
module.exports.logout=logout
module.exports.forgotPassword=forgotPassword
module.exports.resetPassword=resetPassword
