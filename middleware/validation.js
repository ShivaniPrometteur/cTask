const mongoose = require('mongoose')

const isvalid = (value) => {
  if (typeof value != 'string'){return false}
     
  if (typeof value === 'undefined' || typeof value === null){return false}
      
  if (typeof value === 'string' && value.trim().length == 0){return false}
     
  return true
}

const isValidEmail = function(email) {
    return  (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))      //regex used for email validation
  }

  const isValidPhone = function(phone){
    return (/^[6-9]\d{9}$/.test(phone))                    //regex used for phone number validation
}

const isValidObjectId= function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)             //to check _id's are correct or not 
}



  
    

  
module.exports.isvalid = isvalid
module.exports.isValidEmail = isValidEmail
module.exports.isValidPhone=isValidPhone
module.exports.isValidObjectId = isValidObjectId
