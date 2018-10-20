var {mongoose} = require('./db/mongoose.js');
var {table} = require('./db/models/table.js');

var odo = new table({
	tab_row:5,
	tab_col:5,
	cl_id:5bca4f1e1f99865023a1d94e,
	tab_no:1,

});

var tar = ()=>{
	odo.save().then((doc)=>{
	return doc;
},(e)=>{
	return e;
});
};
var a = tar();
console.log(a);

