const mongoose = require('mongoose');
var {Schema} = require('mongoose');

var ModuleSchema = new Schema({
tb_id:{
 	type:Schema.Types.ObjectId,
 	required:true,
 	trim:true,
 	minlength:1,
 	ref:'table'
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
module_id:{
	type:Number,
	required:true,
	minlength:1
}


});
var modules = mongoose.model('modules',ModuleSchema);

module.exports={modules};