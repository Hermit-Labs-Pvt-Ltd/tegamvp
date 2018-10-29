const mongoose = require('mongoose');

var ClientSchema = new mongoose.Schema({
cl_id:{
 	type:Number,
 	trim:true,
 	minlength:true,
 	required:true,
 	unique:true
 },
 cl_info:{
 	type:String,
 	trim:true,
 	minlength:1,
 	default:null
 },
  cl_nam:{
 	type:String,
 	trim:true,
 	minlength:1,
 	default:null
 },
 mqtt_topic:{
 	type:String,
 	trim:true,
 	minlength:1
 }
});

ClientSchema.methods.addnewclient = function () {
 // var new_client = this;
 return this.save.then(()=>{
  return "Success in creating user";
 });
};

ClientSchema.statics.findprevclients = function (){

};

var tegaclient = mongoose.model('client',ClientSchema);

module.exports={tegaclient};