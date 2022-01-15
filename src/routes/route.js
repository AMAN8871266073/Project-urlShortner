const express=require('express')
const router=express.Router()
const urlController=require('../controllers/urlController')
router.post('/shortenUrl',urlController.shortenUrl)
router.get('/:urlCode',urlController.redirectUrl)
module.exports=router