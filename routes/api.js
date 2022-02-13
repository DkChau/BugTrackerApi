const express = require('express');
const router = express.Router();
const apiController = require('../Controllers/apiController');

router.get('/',(req,res)=>{
    res.send('hi')
})

router.get('/project', apiController.getProjects) //Get All Projects
router.post('/project', apiController.createProject) //Create a single project

router.get('/project/:project_id', apiController.getSingleProject) //Get single project
//Update Single Project
//Delete Single Project

router.get('/project/:project_id/bug', apiController.getBugs ) //Get all Bugs
router.post('/project/:project_id/bug', apiController.createBug ) //Create single bug
router.get('/project/:project_id/bug/:bug_id', apiController.getSingleBug)
//Update Single Bug
//Delete Single Bug

router.get('/project/:project_id/bug/:bug_id/comment', apiController.getComments)//Get all comments
router.post('/project/:project_id/bug/:bug_id/comment', apiController.createComment)//Create single comment
router.get('/project/:project_id/bug/:bug_id/comment/:comment_id', apiController.getSingleComment)
//Update Single comment
//Delete Single comment

module.exports = router