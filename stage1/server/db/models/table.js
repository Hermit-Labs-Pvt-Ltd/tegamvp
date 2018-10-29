const mongoose = require('mongoose');
var {Schema} = require('mongoose');
// var Schema = mongoose.Schema;
var TableSchema = new Schema({
	cl_id:{
 	type:Schema.Types.ObjectId,
 	required:true,
 	trim:true,
 	minlength:1,
 	ref:'client'
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
tab_id:{
	type:Number,
	minlength:1,
	required:true
}



});
var table = mongoose.model('table',TableSchema);
module.exports={table};