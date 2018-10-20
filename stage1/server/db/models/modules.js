const mongoose = require('mongoose');
var modules = mongoose.model('modules',{
tb_id:{
 	type:String,
 	required:true,
 	trim:true,
 	minlength:1,
 },
 modules_info:{
 	type:String,
 	trim:true,
 	minlength:1
 },
 dt_init:{
 	type:Number,
 	trim:true,
 	minlength:1
},
 dt_exp:{
 	type:Number,
 	trim:true,
 	minlength:1
},
 pos:{
 	type:Number,
 	minlength:1,
 	required:true
 },
 ex_pos:{
 	type:Number,
 	minlength:1,
 	
 },
 status:{
 	type:String,
 	minlength:1
},
module_no:{
	type:Number,
	required:true,
	minlength:1
}


});
module.exports={modules};