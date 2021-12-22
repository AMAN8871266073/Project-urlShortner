const express=require('express')
const router=express.Router()
const urlController=require('../controllers/urlController')
router.post('/shortenUrl',urlController.urlShortner)
router.get('/:urlCode',urlController.urlRedirector)
module.exports=router