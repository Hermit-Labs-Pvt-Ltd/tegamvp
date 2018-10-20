const mongoose = require('mongoose');
var client = mongoose.model('client',{
 no_tab:{
 	type:Number,
 	trim:true,
 	minlength:1,
 	default:null
 },
 cl_info:{
 	type:String,
 	trim:true,
 	minlength:1,
 	default:null
 },
 status:{
 	type:String,
 	trim:true,
 	minlength:1
 }
});
module.exports={client};