const mongoose = require('mongoose');


const fileNotification = new mongoose.Schema({
  type:{type:String , required:true},
  message:{type:String , reqired:true}, 
  createAt:{type:String , default:new Date()},
  isRead:{type:Boolean , required:false},
})

const fileNotificationSchema = mongoose.model('FileNotification' , fileNotification);
module.exports = fileNotificationSchema;