const mysql = require('mysql')
const {body,param,validationResult} = require('express-validator')
const pool = require('../DatabaseConfig/mysql_config')
const jwt = require('express-jwt');


/* 
    CREATE PROJECT - X
    UPDATE PROJECT - USER/ADMIN ONLY
    DELETE PROJECT - USER/ADMIN ONLY
    GET PROJECTS - X
    GET SINGLE PROJECT - X

    CREATE BUG - X
    UPDATE BUG - USER/ADMIN ONLY
    DELETE BUG - USER/ADMIN ONLY
    GET BUGS - X
    GET SINGLE BUG - X
 
    CREATE COMMENT - X
    UPDATE COMMENT - USER/ADMIN ONLY
    DELETE COMMENT - USER/ADMIN ONLY
    GET COMMENTS - X
    GET SINGLE COMMENT - X
*/
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

function createNewBug(description,status,severity,name,user_id,project_id,connection){
    return new Promise((resolve,reject)=>{
        let queryStr = "INSERT INTO bugs(bug_date,description,status,severity,name,user_id,project_id) VALUES(NOW(), ?, ?, ?, ?, ?, ?)";
        let query = mysql.format(queryStr, [description,status,severity,name,user_id,project_id])

        connection.query(query, function(err,results){
            if(err) return reject(err);
            return resolve(results);
        })
    })
}

exports.getProjects = [
    async function(req,res,next){
        let queryStr = `SELECT * FROM projects`
        let query = mysql.format(queryStr)

        let results = await pool.query(query)
        res.json(results)
    }
]

exports.getSingleProject = [
    async function(req,res,next){
        const {project_id} = req.params;

        let queryStr = `SELECT * FROM projects where id = ?`
        let query = mysql.format(queryStr, [project_id])

        let results = await pool.query(query)
        res.json(results)
    }
]

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
                let projectExist = await checkExist('bugs', name, connection);
                if(projectExist.length!=0){
                    res.send('Project exists already')
                }
                else{
                    let projectCreate = await createNewProject(id,name,description,connection)
                    console.log(projectCreate); //
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

exports.getBugs=[
    async function(req,res,next){
        const {project_id} = req.params;

        let queryStr = `SELECT * FROM bugs WHERE project_id = ?`
        let query = mysql.format(queryStr, [project_id])

        let results = await pool.query(query)
        res.json(results)

    }
]

exports.getSingleBug = [
    async function(req,res,next){
        const {bug_id, project_id} = req.params;

        let queryStr = `SELECT * FROM bugs where id = ? AND project_id = ?`
        let query = mysql.format(queryStr, [bug_id, project_id])

        let results = await pool.query(query)
        res.json(results)
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
        const {name, description, status, severity} = req.body;
        const {project_id} = req.params;
        const {id} = req.user.signedUser;
        pool.getConnection( async (err,connection)=>{
            try{
                let bugExist = await checkExist('bugs', name, connection);
                if(bugExist.length!=0){
                    res.send('Bug exists already')
                }
                else{
                    let bugCreate = await createNewBug(description,status,severity,name,id,project_id,connection)
                    console.log(bugCreate); //
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

exports.getComments = [
    async function(req,res,next){
        const {bug_id} = req.params;

        let queryStr = `SELECT * FROM comments WHERE bug_id = ?`
        let query = mysql.format(queryStr, [bug_id])

        let results = await pool.query(query)
        res.json(results)
    }
]

exports.getSingleComment = [
    async function(req,res,next){
        const {bug_id, project_id, comment_id} = req.params;

        let queryStr = `SELECT * FROM comments WHERE id =? AND bug_id = ? AND project_id = ?`
        let query = mysql.format(queryStr, [comment_id, bug_id, project_id])

        let results = await pool.query(query)
        res.json(results)
    }
]

exports.createComment = [
    jwt({
        secret:process.env.TOKEN_SECRET,
        algorithms: ['HS256'],
        getToken: req => req.cookies.token,
        credentialsRequired:true,
    }),
    async function(req,res,next){
        const {name, description} = req.body;
        const {bug_id, project_id} = req.params;
        const {id} = req.user.signedUser;
        pool.getConnection( async (err,connection)=>{
            try{
                let queryStr = `INSERT INTO comments(user_id, bug_id, project_id, description, comment_date, name) VALUES(?, ?, ?, ?, NOW(), ?)`;
                let query = mysql.format(queryStr, [id,bug_id,project_id,description,name]);

                let results = await pool.query(query) 
                res.json(results)
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
