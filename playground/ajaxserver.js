const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
// var cors = require('cors');

// app.use(express.static(__dirname  +'/htdocs'));
// app.use(cors({
//   origin: 'http://www.mqtest.cf'
// }));

var app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

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


app.post('/',(req,res)=>{
// fetched_data = JSON.parse(req.body);	
res.send("200");
console.log(req.body);
});

app.get('/',(req,res)=>{
res.send("Hello");
console.log(req.body);
});

app.listen(4000,()=>{
console.log('Started on port 4000'); 
});
