const express = require('express');
const router = express.Router();
const apiController = require('../Controllers/apiController');

router.get('/',(req,res)=>{
    res.send('hi')
})

router.get('/bug',  )
router.post('/bug', apiController.createBug )
router.put('/bug', )
router.delete('/bug', )

module.exports = router