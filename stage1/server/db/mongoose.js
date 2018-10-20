var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://www.mqtest.cf:27017/tegamvp');

module.exports={mongoose};