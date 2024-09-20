const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    tpaName: { type: String, required: true },
  });
  
const EmployeeRequestSchema = new mongoose.Schema({
    account:{type:String , required:true},
    employees: [EmployeeSchema], // Store multiple employees as an array
    createAt:{type:String , default:new Date()},
    isRead:{type:Boolean , default:false}
  });
  
  module.exports = mongoose.model("EmployeeRequest", EmployeeRequestSchema);