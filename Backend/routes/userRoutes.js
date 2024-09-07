const express = require('express');
const router = express.Router();
const { createUser, upload } = require('../controllers/userControllers');
// const authenticateAdmin = require("../controllers/authController");

router.post('/createaccount', upload.fields([
  { name: 'cdStatementFile', maxCount: 1 },
  { name: 'claimSelfAnalysisFile', maxCount: 1 },
  { name: 'claimFloaterAnalysisFile', maxCount: 1 },
  { name: 'claimDumpSelfFile', maxCount: 1 },
  { name: 'claimDumpFloaterFile', maxCount: 1 },
  { name: 'liveDataSelfFile', maxCount: 1 },
  { name: 'liveDataFloaterFile', maxCount: 1 },
  // { name: 'endrosementSelfFile', maxCount: 1 },
  // { name: 'endrosementFloaterFile', maxCount: 1 },
  { name: 'claimABFile', maxCount: 1 },
  { name: 'rackRatesFile', maxCount: 1 },
  { name: 'checkListFile', maxCount: 1 },
  { name: 'exclusionListFile', maxCount: 1 },
  // { name: 'deletionDataSelfFile', maxCount: 1 },
  { name: 'additionDataFile', maxCount: 1 },
  // { name: 'additionDataSelfFile', maxCount: 1 },
  { name: 'deletionDataFile', maxCount: 1 },
  { name: 'policyCoverageSelfFile', maxCount: 1 },
  { name: 'policyCoverageFloaterFile', maxCount: 1 },
]), createUser);

module.exports = router;
