const express = require('express');//Requiring the Express Server Module
const mqtt = require ('mqtt');//Requirirng the MQTT Module
const fs = require('fs');//Requiring the FileSystem Module
var WebSocketServer = require("ws").Server;//Requiring the Web Socket Module
const https = require('https');//Requiring the HTTPS Module
const bodyParser = require('body-parser');//Requiring the Body Parser Module

//Requiring Files from local Directories
var {mongoose} = require('./db/mongoose.js'); //Mongoose Configuration File
var {tegaclient} = require('./db/models/client.js');
var {table} = require('./db/models/table.js');
var {modules} = require('./db/models/modules.js');

var app = express();

//Body Parser setup with express to parse the JSON body sent by the frontend
app.use(bodyParser.json());

//Setting up the CORS functionality in Express for Making AJAX calls
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

//Creating a log for maintaining all the server requests
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


//Setting up the POST routes for the addition of module
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
	res.send(400).send(e);
});

console.log(req.body);
});


//POST route for the addition of new client 
app.post('/newclient',(req,res)=>{
//Query to count the number of clients which are already present in the system 
tegaclient.countDocuments((err,count)=>{
//If it's the first client give him the first id  
  if(count == 0){
    req.body.cl_id = 1;
  }
  else //iterate the number of modules already present and give him the id
    req.body.cl_id = count + 1;

//For saving the new client , instantiating the module
  var new_client = new tegaclient(req.body);

  //Saving the new instance in the database 
  new_client.save().then((doc)=>{
  res.send("200");//Sending a ok respnse back to the requesting 
  });

}).catch((err)=>{
  res.send(err);
});
 
});

//POST Route for the creation of a new table 
app.post('/newtable',(req,res)=>{

 //Finding the associated client id from the front-end and finding the actual object id associated with it and then finding the number of tables  which have the same OBID and then accordingly allocating the table with a id

//Finding the OBID of the given client id
 tegaclient.findOne({'cl_id': req.body.cl_id},'_id').then((id)=>{
 	req.body.cl_id = id;
    // console.log(req.body);
    return req.body;
 
 }).then(()=>{ //Fiding the number of tables which are already present or the particular client

    table.countDocuments({cl_id : req.body.cl_id},(err,count)=>{
 	// console.log(req.body);

   if(count == 0 || count == null || !count){
    req.body.tab_id = 1;
  }

  else{
    req.body.tab_id = count + 1;
  }

  // res.send(req.body);
//Creating an instance of the new table that is to be saved 
  var new_table = new table(req.body);
  // Saving the new table into the database
  new_table.save().then((doc)=>{
   res.send("200");//Sending back the status code of ok
  });

   });

 }).catch((err)=>{

   console.log(err);

 });


 });


//POST Route for the addition of a new module into the system
app.post('/newmodule',(req,res)=>{

//Query for finding out the OBID of the client id which is provided at the fromt end 
 tegaclient.findOne({'cl_id': req.body.cl_id},'_id').then((id)=>{
 	req.body.cl_id = id;
    return req.body;

 }).then(()=>{
 	//Query for finding out the OBID of the table which has the client attached t it
 	table.findOne({'cl_id':req.body.cl_id , 'tab_id':req.body.tab_id},'_id').then((id)=>{
 		req.body.tb_id = id;
 		//Instantiating a new module which has the properties of the new module
 		var add_module = new modules({
          pos:req.body.pos,
          tb_id:req.body.tb_id,
          module_id:req.body.module_id
 	});
 		//saving the new module in the database
 		add_module.save().then((doc)=>{
 			res.send(doc);
 		});
 }).catch((err)=>{
 	console.log("Error is "+err);
 });
});
// console.log(req.body);
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
  client.subscribe('#');
  console.log('client has subscribed successfully to the MQTT topic');
});




//On receiving message from the MQTT Broker
client.on('message',function(topic,message) {
	
//console.log(topic);

var temp = message.toString();

if (temp.status == "200"){
  console.log("Panel has been installed successfully");
}
//Sending Message to Each of the subscribed clients on WebSockets
wss.clients.forEach(function(clients) {
  if(topic == "panelchecking"){
clients.send(message.toString());
// console.log(message.toString + now);
}
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
