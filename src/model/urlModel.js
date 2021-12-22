const mongoose=require('mongoose')
const urlSchema=new mongoose.Schema({
    longUrl: {type:String,
        required:true,
        trim:true,
        validate:{
            validator:function(longUrl){
                return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(longUrl)
            },message:'please enter valid url',isAsync:false
        }},
    shortUrl: {type:String,
        required:true,
        unique:true} ,
     urlCode: { type:String,
        required:true,
        unique:true,
        lowercase:true,
         trim:true}, 
},{timestamps:true})
module.exports=mongoose.model('url',urlSchema) 