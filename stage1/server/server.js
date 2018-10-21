const express = require('express');//Requiring the Express Server Module
const mqtt = require ('mqtt');//Requirirng the MQTT Module
const fs = require('fs');//Requiring the FileSystem Module
var WebSocketServer = require("ws").Server;//Requiring the Web Socket Module
const https = require('https');//Requiring the HTTPS Module
const bodyParser = require('body-parser');//Requiring the Body Parser Module

//Requiring Files from local Directories
var {mongoose} = require('./db/mongoose.js'); //Mongoose Configuration File
var {client} = require('./db/models/client.js');
var {table} = require('./db/models/table.js');
var {modules} = require('./db/models/modules.js');

//Creating a log for maintaining all the server requests
var app = express();
app.use((req,res,next)=>{
 var now = new Date().toString();
 var log =`${now}: ${req.method} ${req.url}`;
 fs.appendFile('server.log',log+'\n',(err)=>{
  if(err){
    console.log('Unable to append server.log.');
  }
 });
 next();
});

//Body Parser setup with express to parse the JSON body sent by the frontend
app.use(bodyParser.json());

//Setting up the CORS functionality in Express for Making AJAX calls
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

//Setting up the POST routes 
app.post('/',(req,res)=>{

console.log(req.body.cell_id);
console.log(req.body.panel_id);

//Adding the fetched value into the database , initiating the values using imported the constructor function "add_module"
var add_module = new modules({
tb_id:"5bca5357d369c750e6366be1", //Prefixed the id of the first table

//Entering the parsed values into the database 
pos:req.body.cell_id,
module_no:req.body.panel_id
});

//Saving the database transaction (firing it)
add_module.save().then((doc)=>{
res.send("200");
},(e)=>{
	res.status(400).send(e);
});

console.log(req.body);
});

//GET route configuration
app.get('/',(req,res)=>{
res.send("Hello");
console.log(req.body);
});

//Setting up the socket server to use the SSL certificates
const server = new https.createServer({
  cert: fs.readFileSync('/etc/lego/certificates/www.mqtest.cf.crt'),
  key: fs.readFileSync('/etc/lego/certificates/www.mqtest.cf.key')
});

//MQTT server connection initiaton
var client  = mqtt.connect('1883:www.mqtest.cf');//Port 1883 for MQTT Broker

//Socket Server Connection Initiation 
var wss = new WebSocketServer({server});
console.log("Socket server started");



//On Connection with MQTT Topic
client.on('connect', function () {
  client.subscribe('hello/cat');
  console.log('client has subscribed successfully to the MQTT topic');
});

//On receiving message from the MQTT Broker
client.on('message',function(topic,message) {
	
//Sending Message to Each of the subscribed clients on WebSockets
wss.clients.forEach(function(clients) {
clients.send(message.toString());
});

});




//On Connection with Socket Server
wss.on("connection",function(ws) {
 ws.send("Welcome Hermit Broker");
  //Fetching messages from client side 
  ws.on("message",(data)=>{
  console.log(data);
  client.publish("hello/cat",data);
 });

});

//Port 3000 for Websocket
server.listen(3000,()=>{
console.log('Started on port 3000'); 
});

//Port 4000 for App
app.listen(4000,()=>{
console.log('Started on port 4000'); 
});
