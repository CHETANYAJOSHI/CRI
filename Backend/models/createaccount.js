const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  TPAName: {
    type: String,
    required: true,
  },
  InsuranceName: {
    type: String,
    required: true,
  },
  hrName: {
    type: String,
    required: true,
  },
  hrEmail: {
    type: String,
    required: true,
    
  },
  hrNumber: {
    type: String,
    required: true,
    
  },
  // corporateName: {
  //   type: String,
  //   required: true,
  // },
  networkHospitalLink: {
    type: String,
    required: false,
  },
  cdStatementFile: {
    type: String,
    required: false,
  },
  claimSelfAnalysisFile: {
    type: String,
    required: false,
  },
  claimFloaterAnalysisFile: {
    type: String,
    required: false,
  },
  claimDumpSelfFile: {
    type: String,
    required: false,
  },
  claimDumpFloaterFile:{ 
    type:String,
    required:false
  },
  liveDataSelfFile:{ 
    type:String,
    required:false
  },
  liveDataFloaterFile:{ 
    type:String,
    required:false
  },
  // endrosementAdditionFile:{ 
  //   type:String,
  //   required:false
  // },
  // endrosementDeletionFile:{ 
  //   type:String,
  //   required:false
  // },
  claimABFile:{ 
    type:String,
    required:false
  },
  rackRatesFile:{
    type:String,
    required:false
  },
  checkListFile:{ 
    type:String,
    required:false
  },
  exclusionListFile:{ 
    type:String,
    required:false
  },
  // deletionDataSelfFile:{ 
  //   type:String,
  //   required:false
  // },
  additionDataFile:{ 
    type:String,
    required:false
  },
  // additionDataSelfFile:{ 
  //   type:String,
  //   required:false
  // },
  deletionDataFile:{ 
    type:String,
    required:false
  },
  policyCoverageSelfFile:{
    type:String,
    required:false
  },
  policyCoverageFloaterFile:{
    type:String,
    required:false
  },

});




module.exports = mongoose.model('Accounts', UserSchema);