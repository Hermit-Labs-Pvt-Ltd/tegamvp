const mongoose = require('mongoose');
var table = mongoose.model('table',{
 cl_id:{
 	type:String,
 	required:true,
 	trim:true,
 	minlength:1,
 	unique:true
 },
 tab_row:{
 	type:Number,
 	trim:true,
 	minlength:1,
 	required:true
 },
 tab_col:{
 	type:String,
 	trim:true,
 	minlength:1,
 	required:true
 },
 tab_info:{
 	type:String,
 	trim:true,
 	minlength:1
 },
 rep_no:{
 	type:Number,
 	trim:true,
 	minlength:1
},
 last_ping:{
 	type:Number,
 	minlength:1
 },
 status:{
 	type:String,
 	minlength:1
},
tab_no:{
	type:Number,
	minlength:1
}


});
module.exports={table};