const express = require('express')
const router = express.Router()





router.post('register', accessController.signUp)



module.exports = router