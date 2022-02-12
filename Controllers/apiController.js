const mysql = require('mysql')
const {body,param,validationResult} = require('express-validator')
const pool = require('../DatabaseConfig/mysql_config')
const jwt = require('express-jwt');

function checkExist(db, name, connection){
    return new Promise((resolve,reject)=>{
        let queryStr = `SELECT * FROM ${db} WHERE name = ?`;
        let query = mysql.format(queryStr, [name])

        connection.query(query, function(err,results){
            if(err) return reject(err);
            return resolve(results);
        })
    })
}

function createNewProject(userId, name, description,connection){
    return new Promise((resolve,reject)=>{
        let queryStr = "INSERT INTO projects(user_id, name, project_date, description) VALUES(?,?,NOW(),?)";
        let query = mysql.format(queryStr, [userId,name,description])

        connection.query(query, function(err,results){
            if(err) return reject(err);
            return resolve(results);
        })
    })
}

exports.createProject=[
    jwt({
        secret:process.env.TOKEN_SECRET,
        algorithms: ['HS256'],
        getToken: req => req.cookies.token,
        credentialsRequired:true,
    }),
    async function(req,res,next){
        const {name, description} = req.body;
        const {id} = req.user.signedUser;
        pool.getConnection( async (err,connection)=>{
            try{
                let projectExist = await checkExist('projects', name, connection);
                if(projectExist.length!=0){
                    res.send('Project exists already')
                }
                else{
                    let projectCreate = await createNewProject(id,name,description,connection)
                    console.log(projectCreate);
                    res.send('Should work')
                }
            }
            catch(err){
                res.send(err)
            }
            finally{
                connection.release();
            }
        })
    }
]

exports.createBug=[
    jwt({
        secret:process.env.TOKEN_SECRET,
        algorithms: ['HS256'],
        getToken: req => req.cookies.token,
        credentialsRequired:true,
    }),
    async function(req,res,next){
        const {name, description, project_id} = req.body;
        const {id} = req.user.signedUser;
        pool.getConnection( async (err,connection)=>{
            try{
                let projectExist = await checkExist('projects', name, connection);
                if(projectExist.length!=0){
                    res.send('Project exists already')
                }
                else{
                    let projectCreate = await createNewProject(id,name,description,connection)
                    console.log(projectCreate);
                    res.send('Should work')
                }
            }
            catch(err){
                res.send(err)
            }
            finally{
                connection.release();
            }
        })
    }
]
