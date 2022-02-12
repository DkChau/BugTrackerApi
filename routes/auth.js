const router = require('express').Router();
const con = require('../DatabaseConfig/mysql_config');
const authController = require('../Controllers/authController');

//Normal application check here
router.get('/', (req,res,next)=>{
    res.send('hi') 
})

router.post('/signup', authController.signUpUser)

router.post('/login', authController.LogInUser)

module.exports = router;