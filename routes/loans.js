const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Create a new loan application
router.post('/', loanController.createLoan);

// Get all loans
router.get('/', loanController.getLoans);

// Update loan status
router.patch('/:id/status', loanController.updateLoanStatus);

// Get a single loan
router.get('/:id', loanController.getLoan);

module.exports = router;
