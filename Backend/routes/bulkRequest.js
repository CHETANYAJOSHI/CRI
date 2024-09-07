// routes/bulkRequests.js
const express = require("express");
const router = express.Router();
const BulkRequest = require("../models/BulkRequest");

// POST /api/bulkRequests - Create a new bulk request
router.post("/bulkRequests", async (req, res) => {
  try {
    const { requestDetails, selectedAccount } = req.body;

    const newRequest = new BulkRequest({
      description: requestDetails,
      account: selectedAccount,
      status: "Pending", // Set initial status as "pending"
    });

    await newRequest.save();
    res.status(201).json({ message: "Bulk request created successfully", newRequest });
  } catch (err) {
    res.status(500).json({ error: "Failed to create bulk request" });
  }
});

module.exports = router;
