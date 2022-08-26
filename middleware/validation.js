const mongoose = require('mongoose')

const isvalid = (value) => {
  if (typeof value != 'string'){return false}
     
  if (typeof value === 'undefined' || typeof value === null){return false}
      
  if (typeof value === 'string' && value.trim().length == 0){return false}
     
  return true
}

const isValidEmail = function(email) {
    return  (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))
  }

  const isValidPhone = function(phone){
    return (/^[6-9]\d{9}$/.test(phone))
}

const isValidObjectId= function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)
}



  
    

  
module.exports.isvalid = isvalid
module.exports.isValidEmail = isValidEmail
module.exports.isValidPhone=isValidPhone
module.exports.isValidObjectId = isValidObjectId
