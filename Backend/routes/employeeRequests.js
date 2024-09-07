const express = require("express");
const router = express.Router();
const EmployeeRequest = require("../models/EmployeeRequest");

// POST /api/employeeRequests
router.post("/employeeRequest", async (req, res) => {
  try {
    const {employees , selectedAccount} = req.body;

    // Validate if account and employees are provided
    if (!selectedAccount || !employees || employees.length === 0) {
      return res.status(400).json({ error: "Account and employee details are required." });
    }

    // Create a new EmployeeRequest document
    const newRequest = new EmployeeRequest({  employees,account:selectedAccount });
    await newRequest.save();

    res.status(201).json({ message: "Employee e-card request saved successfully!" });
  } catch (error) {
    console.error("Error saving employee request:", error);
    res.status(500).json({ error: "Failed to save employee e-card request." });
  }
});


module.exports = router;
