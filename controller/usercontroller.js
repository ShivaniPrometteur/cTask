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

        
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, message: "Please enter Data like firstname lastname" }) }

        const { fname, lname, email, phone, password, address } = data
        if (!validator.isvalid(fname)) { return res.status(400).send({ status: false, massage: "Please enter first name" }) }

        if (!validator.isvalid(lname)) { return res.status(400).send({ status: false, massage: "Please enter last name" }) }

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, massage: "Please enter email" })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, massage: "Please enter correct email" })
        }
        const emailFind = await userModel.findOne({ email: email })
        if (emailFind) {
            return res.status(400).send({ status: false, massage: "Email alrady Exist" })
        }


        if (!validator.isvalid(phone)) { return res.status(400).send({ status: false, massage: "Please enter phone" }) }
        if (!validator.isValidPhone(phone)) { return res.status(400).send({ status: false, massage: "Enter Correct mobile Number" }) }
        let mobileNumber = await userModel.findOne({ phone: phone })
        if (mobileNumber) { return res.status(400).send({ status: false, massage: "mobile Number alrady exist" }) }
        if (!validator.isvalid(address)) { return res.status(400).send({ status: false, massage: "Please enter address" }) }
        if (!validator.isvalid(password)) { return res.status(400).send({ status: false, massage: "Please enter password" }) }
        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, massage: "Please length should be 8 to 15 password" }) }
        const hash = bcrypt.hashSync(password, 6);
        data.password = hash

        
        const profilePic = req.files
        if (profilePic && profilePic.length > 0) {

            let uploadedFileURL = await uploadAws.uploadFile(profilePic[0])
            data.profileImage = uploadedFileURL
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
            return res.status(400).send({ status: false, message: "Invalid request parameters. please provide login details" })
        }

        const { email, password } = requestbody;

        if (!validator.isvalid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: `Email is not correct ` })
        }

        if (!validator.isvalid(password)) {
            res.status(400).send({ status: false, message: `password is required` })
            return
        }

        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(401).send({ status: false, message: 'email is wrong' })
        }
        const decrpted = bcrypt.compareSync(password, user.password);
        if (decrpted == true) {
            const token = await jwt.sign({
                UserId: user._id,
            }, 'privatekey', { expiresIn: "10h" })

            const abc = res.setHeader('authorization', `Bearer ${token}`);
            let loginstatus=await userModel.findOneAndUpdate({email:email},{status:'loggedin'})
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

        if (req.decodedToken.UserId == UserId && u_details.status=='loggedin') {

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
        //let data = JSON.parse(JSON.stringify(data1))
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




        if (req.decodedToken.UserId == userId && u_details.status=='loggedin') {
            const { fname, lname, email, phone, password, address, } = data

            let profile = { address: u_details.address }

            if (validator.isvalid(fname)) {
                profile['fname'] = fname
            }



            if (validator.isvalid(lname)) {
                profile['lname'] = lname
            }


            if (validator.isvalid(email)) {
                if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, massage: "email is not correct formate enter correct email id" }) }
                let emailFind = await userModel.findOne({ email: email })
                if (emailFind) { return res.status(400).send({ status: false, massage: "Email id already exist" }) }
                profile['email'] = email
            }


            if (validator.isvalid(phone)) {
                if (!validator.isValidPhone(phone)) { return res.status(400).send({ status: false, massage: "phone not correct enter correct phone" }) }
                let phoneFind = await userModel.findOne({ phone: phone })
                if (phoneFind) return res.status(400).send({ status: false, massage: "phone no already exist" })
                profile['phone'] = phone
            }

            if (validator.isvalid(password)) {
                if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, massage: "please length should be 8 to 15 password" }) }
                const hash = bcrypt.hashSync(password, 6);
                profile['password'] = hash
            }

            if (profilePic && profilePic.length > 0) {
                const profilePic = req.files
                let uploadedFileURL = await uploadAws.uploadFile(profilePic[0])
                profile['profileImage'] = uploadedFileURL
            }

            if (validator.isvalid(address)) {
                profile['address'] = address
            }


            
            let updated = await userModel.findOneAndUpdate({ _id: userId }, { $set: profile }, { new: true })

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
        const user =  await userModel.findByIdAndDelete(user_id)
       
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
         if(!new_password || new_password == ""){
            return res.status(200).json({
                status: 400,
                message: 'Password Cannot be empty.'
            })
         }

         if (req.decodedToken.UserId == userId && user.status=='loggedin') {
         if (validator.isvalid(new_password)) {
            if (new_password.length < 8 || new_password.length > 15) { return res.status(400).send({ status: false, massage: "please length should be 8 to 15 password" }) }
            const hash = bcrypt.hashSync(new_password, 6);
            profile['password'] = hash
        }

        
           await userModel.findByIdAndUpdate(user._id,{ $set: profile }, { new: true }); 
            
        
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
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });

        const mailOptions={
            from:config.emailUser,
            to:email,
            subject:'To Reset The Password',
            html:'Hii '+name+' ,Please copy the link<a href="http://127.0.0.1:3000/resetPassword?token='+token+'"></a> in Your browser and reset your password'

        }

        transporter.sendMail(mailOptions,function(error,info){
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
        const userData=await userModel.findOne({email:email});
        
        if(userData){
           const randomString= randomstring.generate()
           let data=await userModel.updateOne({email:email},{$set:{token:randomString}})
           sendResetPasswordMail(userData.fname,userData.email,randomString);
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
        const tokenData=await userModel.findOne({token:token});

        if(tokenData){
            const password=req.body.password
            const newPassword=bcrypt.hashSync(password, 6)
            const userData=await userModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true})
            res.status(200).send({success:true,msg:"Password successfully updated",data:userData})
        }else{
            return res.status(400).send({message:"This has been expired"})
        }

    }catch(err){
        return res.status(500).send(e.message);
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
         let loggedout=await userModel.findByIdAndUpdate(userId,{status:'loggedout'})

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
