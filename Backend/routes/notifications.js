const express = require('express');
const router = express.Router();
const BulkRequest = require('../models/BulkRequest');
const Account = require('../models/createaccount');

// GET /api/notifications - Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    // Fetch all bulk requests (or apply filters if needed)
    const bulkRequests = await BulkRequest.find();

    if (bulkRequests.length === 0) {
      return res.status(404).json({ error: 'No bulk requests found' });
    }

    // Fetch account details for each unique account ID
    const accountIds = [...new Set(bulkRequests.map(request => request.account))];
    const accounts = await Account.find({ _id: { $in: accountIds } });

    // Create a mapping from account ID to account details
    const accountMap = accounts.reduce((map, account) => {
      map[account._id] = account;
      return map;
    }, {});

    // Construct response for multiple bulk requests
    const notifications = bulkRequests.map(request => {
      const account = accountMap[request.account];
      return { 
        AccountName : account?.accountName || 'N/A',
        hrName: account?.hrName || 'N/A',
        tpaName: account?.TPAName || 'N/A',
        emailId: account?.hrEmail || 'N/A',
        description: request.description,
        status: request.status,
        account:request.account,
        createdAt: request.createdAt
      };
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification details' });
  }
});


router.put('/updatenotifications', async (req, res) => {
  try {
    const { account, status } = req.body;

    // Find the notification by the account name
    const notification = await BulkRequest.findOne({ account });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update the status
    notification.status = status;
    await notification.save();

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

  
module.exports = router;
