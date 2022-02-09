const {body,param,validationResult} = require('express-validator')
var con = require('../DatabaseConfig/mysql_config').con;

exports.createBug=[
    function(req,res,next){
            console.log(req.body.bug_date,req.body.description,req.body.status)
            res.send('received')
    }
]