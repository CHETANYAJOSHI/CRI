const mongoose = require('mongoose');


const fileNotification = new mongoose.Schema({
  type:{type:String , required:true},
  message:{type:String , reqired:true}, 
  date:{type:Date , reqired:Date.now},
  read:{type:Boolean , required:false} 
})

const fileNotificationSchema = mongoose.model('FileNotification' , fileNotification);
module.exports = fileNotificationSchema;