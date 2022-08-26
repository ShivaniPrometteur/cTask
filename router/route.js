const express = require('express')
// const { route } = require('express/lib/application')
// const res = require('express/lib/response')
const router = express.Router()
const userController = require('../controller/usercontroller')
const auth = require('../middleware/middleware')



router.post('/register' ,userController.registration)

router.post('/login' , userController.loginUser)

router.get('/user/:userId/profile' ,auth.authentication ,userController.getUser )

router.put('/user/:userId/profile',auth.authentication,userController.updateUser)

router.delete('/user/:userId/profile',auth.authentication,userController.deluser)

router.put('/user/:userId/changePassword',auth.authentication,userController.changePassword)

router.post('/forgotPassword',userController.forgotPassword)

router.get('/resetPassword',userController.resetPassword)


router.put('/user/:userId/logout',auth.authentication,userController.logout)




module.exports = router