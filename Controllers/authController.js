const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const {body,param,validationResult} = require('express-validator')
const pool = require('../DatabaseConfig/mysql_config');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

require('dotenv').config();

function checkUserExist(username, connection){
    return new Promise((resolve,reject)=>{
        let queryStr = "SELECT * FROM users WHERE username = ?";
        let query = mysql.format(queryStr, username)

        connection.query(query, function(err,results){
            if(err) return reject(err);
            return resolve(results);
        })
    })
}

function createNewUser(username, password, name, connection){
    return new Promise((resolve,reject)=>{
        let queryStr = "INSERT INTO users(username,password,name, authorization) VALUES(?,?,?,0)";
        let query = mysql.format(queryStr, [username, password, name])

        connection.query(query, function(err,results){
            if(err) return reject(err);
            return resolve(results);
        })
    })
}

exports.signUpUser = [
    //Need validation of inputs
    async function(req,res,next){
        const {username, name} = req.body;
        const hashedPassword = await bcrypt.hash(req.body.password,10);

        pool.getConnection(async function(err,connection){
            if(err) throw err;
            //Need error handling using then and catch
            let userExist = await checkUserExist(username, connection)
            if(userExist.length!=0){
                res.send('User exists already')
            }
            else{
                let userCreate = await createNewUser(username,hashedPassword,name,connection)
                console.log(userCreate);
                res.send('Should work')
            }
            connection.release();
        })
    }
]

exports.LogInUser = [
    //Need validation of inputs
    async function(req,res,next){
        const {username, password} = req.body;

        pool.getConnection(async function(err,connection){
            if(err) throw err;
            //Need error handling using then and catch
            let user = await checkUserExist(username, connection)
            if(user.length!=0){
                try{
                    const validPassword = await bcrypt.compare(password, user[0].password.toString());
                    if(validPassword){
                        let signedUser = user[0];
                        let token = jsonwebtoken.sign({signedUser}, process.env.TOKEN_SECRET)
                        res.setHeader('set-cookie', [
                            `token=${token}; SameSite=None; Secure; HttpOnly=true; Max-Age=86400`
                        ])
                        res.json({token})
                    }
                    else{
                        res.send('Wrong Password')
                    }
                }
                catch(err){
                    res.send(err)
                }
            }
            else{
                res.send('User does not exist')
            }
            connection.release();
        })
    }
]
