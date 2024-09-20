const mongoose = require('mongoose');

const BulkRequestSchema = new mongoose.Schema({
    description : {type:String , required:true},
    account:{type:String , required:true},
    status:{type:String , enum:["Pending" , "Done"] , default:"Pending"},
    createAt:{type:String , default:new Date()},
    isRead:{type:Boolean , default:false}
})

// BulkRequestSchema.virtual('formattedCreatedAt').get(function () {
//     return this.createdAt.toLocaleDateString(); // Customize the date format if needed
//   });
  
//   // Ensure virtuals are serialized
//   BulkRequestSchema.set('toJSON', {
//     virtuals: true,
//   });

module.exports = mongoose.model("BulkRequest" , BulkRequestSchema);