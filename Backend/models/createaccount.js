// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  networkHospitalLink: {
    type: String,
    required: false,
  },
  
  claimsFile: {
    type: String,
    required: false,
  },
  exclusionFile: {
    type: String,
    required: false,
  },
  checklistFile: {
    type: String,
    required: false,
  },
  liveDataFile: {
    type: String,
    required: false,
  },
  cdStatementFile:{ 
    type:String,
    required:false
  },
  claimFormFile:{ 
    type:String,
    required:false
  },
  claimAnalysisFile:{ 
    type:String,
    required:false
  },
  claimDumpFile:{ 
    type:String,
    required:false
  },
  EndorsementFile:{ 
    type:String,
    required:false
  }

});

module.exports = mongoose.model('Accounts', UserSchema);
