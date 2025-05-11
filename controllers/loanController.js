const mongoose = require('mongoose');
const Loan = require('../models/Loan');

// Create a new loan application
exports.createLoan = async (req, res) => {
  try {
    const { fullName, loanAmount, loanTenure, employmentStatus, reasonForLoan, employerAddress } = req.body;

    // Validate required fields
    if (!fullName || !loanAmount || !loanTenure || !employmentStatus || !reasonForLoan || !employerAddress) {
      return res.status(400).json({
        success: false,
        error: 'All fields (fullName, loanAmount, loanTenure, employmentStatus, reasonForLoan, employerAddress) are required'
      });
    }

    // Validate numeric fields
    if (isNaN(loanAmount) || loanAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanAmount must be a positive number'
      });
    }
    if (isNaN(loanTenure) || loanTenure <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanTenure must be a positive integer'
      });
    }

    const loanData = {
      fullName,
      loanAmount: parseFloat(loanAmount),
      loanTenure: parseInt(loanTenure),
      employmentStatus,
      reasonForLoan,
      employerAddress,
      officer: 'Loan Officer',
      dateApplied: new Date(),
      status: 'PENDING'
      // statusColor is set by schema middleware
    };

    const loan = new Loan(loanData);
    await loan.save();

    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all loans with pagination
exports.getLoans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loans = await Loan.find()
      .sort({ dateApplied: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments();

    const formattedLoans = loans.map(loan => ({
      id: loan._id,
      fullName: loan.fullName,
      amount: loan.loanAmount,
      tenure: loan.loanTenure,
      employmentStatus: loan.employmentStatus,
      reasonForLoan: loan.reasonForLoan,
      employerAddress: loan.employerAddress,
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: loan.status,
      statusColor: loan.statusColor,
      officer: loan.officer || 'Loan Officer'
    }));

    res.json({
      success: true,
      data: formattedLoans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid loan ID'
      });
    }

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { $set: { status } }, // statusColor is set by schema middleware
      { new: true, runValidators: false }
    );

    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Format the response for frontend consistency
    const formattedLoan = {
      id: updatedLoan._id,
      fullName: updatedLoan.fullName,
      amount: updatedLoan.loanAmount,
      tenure: updatedLoan.loanTenure,
      employmentStatus: updatedLoan.employmentStatus,
      reasonForLoan: updatedLoan.reasonForLoan,
      employerAddress: updatedLoan.employerAddress,
      date: new Date(updatedLoan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: updatedLoan.status,
      statusColor: updatedLoan.statusColor,
      officer: updatedLoan.officer || 'Loan Officer'
    };

    res.json({
      success: true,
      data: formattedLoan
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single loan
exports.getLoan = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid loan ID'
      });
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Format the loan for frontend consistency
    const formattedLoan = {
      id: loan._id,
      fullName: loan.fullName,
      amount: loan.loanAmount,
      tenure: loan.loanTenure,
      employmentStatus: loan.employmentStatus,
      reasonForLoan: loan.reasonForLoan,
      employerAddress: loan.employerAddress,
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: loan.status,
      statusColor: loan.statusColor,
      officer: loan.officer || 'Loan Officer'
    };

    res.json({
      success: true,
      data: formattedLoan
    });
  } catch (error) {
    console.error('Error fetching loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



/*
const mongoose = require('mongoose');
const Loan = require('../models/Loan');

// Create a new loan application
exports.createLoan = async (req, res) => {
  try {
    const { fullName, loanAmount, loanTenure, employmentStatus, reasonForLoan, employerAddress } = req.body;

    // Validate required fields
    if (!fullName || !loanAmount || !loanTenure || !employmentStatus || !reasonForLoan || !employerAddress) {
      return res.status(400).json({
        success: false,
        error: 'All fields (fullName, loanAmount, loanTenure, employmentStatus, reasonForLoan, employerAddress) are required'
      });
    }

    // Validate numeric fields
    if (isNaN(loanAmount) || loanAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanAmount must be a positive number'
      });
    }
    if (isNaN(loanTenure) || loanTenure <= 0) {
      return res.status(400).json({
        success: false,
        error: 'loanTenure must be a positive integer'
      });
    }

    const loanData = {
      fullName,
      loanAmount: parseFloat(loanAmount),
      loanTenure: parseInt(loanTenure),
      employmentStatus,
      reasonForLoan,
      employerAddress,
      officer: 'Loan Officer',
      dateApplied: new Date(),
      status: 'PENDING',
      statusColor: 'pending'
    };

    const loan = new Loan(loanData);
    await loan.save();

    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all loans with pagination
exports.getLoans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loans = await Loan.find()
      .sort({ dateApplied: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Loan.countDocuments();

    const formattedLoans = loans.map(loan => ({
      id: loan._id,
      fullName: loan.fullName,
      amount: loan.loanAmount,
      tenure: loan.loanTenure,
      employmentStatus: loan.employmentStatus,
      reasonForLoan: loan.reasonForLoan,
      employerAddress: loan.employerAddress,
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: loan.status,
      statusColor: loan.statusColor,
      officer: loan.officer || 'Loan Officer'
    }));

    res.json({
      success: true,
      data: formattedLoans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid loan ID'
      });
    }

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    // Determine status color
    let statusColor;
    switch (status) {
      case 'PENDING':
        statusColor = 'pending';
        break;
      case 'APPROVED':
        statusColor = 'approved';
        break;
      case 'REJECTED':
        statusColor = 'rejected';
        break;
      case 'DISBURSED':
        statusColor = 'disbursed';
        break;
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { $set: { status, statusColor } },
      { new: true, runValidators: false }
    );

    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Format the response for frontend consistency
    const formattedLoan = {
      id: updatedLoan._id,
      fullName: updatedLoan.fullName,
      amount: updatedLoan.loanAmount,
      tenure: updatedLoan.loanTenure,
      employmentStatus: updatedLoan.employmentStatus,
      reasonForLoan: updatedLoan.reasonForLoan,
      employerAddress: updatedLoan.employerAddress,
      date: new Date(updatedLoan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: updatedLoan.status,
      statusColor: updatedLoan.statusColor,
      officer: updatedLoan.officer || 'Loan Officer'
    };

    res.json({
      success: true,
      data: formattedLoan
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single loan
exports.getLoan = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid loan ID'
      });
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Format the loan for frontend consistency
    const formattedLoan = {
      id: loan._id,
      fullName: loan.fullName,
      amount: loan.loanAmount,
      tenure: loan.loanTenure,
      employmentStatus: loan.employmentStatus,
      reasonForLoan: loan.reasonForLoan,
      employerAddress: loan.employerAddress,
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: loan.status,
      statusColor: loan.statusColor,
      officer: loan.officer || 'Loan Officer'
    };

    res.json({
      success: true,
      data: formattedLoan
    });
  } catch (error) {
    console.error('Error fetching loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



const Loan = require('../models/Loan');

// Create a new loan application
exports.createLoan = async (req, res) => {
  try {
    const loanData = {
      ...req.body,
      officer: 'Loan Officer', // Default loan officer
      dateApplied: new Date(),
      status: 'PENDING',
      statusColor: 'pending'
    };

    const loan = new Loan(loanData);
    await loan.save();

    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ dateApplied: -1 });

    // Format the loans for frontend display
    const formattedLoans = loans.map(loan => ({
      id: loan._id,
      fullName: loan.fullName,
      amount: loan.loanAmount,
      tenure: loan.loanTenure,
      employmentStatus: loan.employmentStatus,
      reasonForLoan: loan.reasonForLoan,
      employerAddress: loan.employerAddress,
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: loan.status,
      statusColor: loan.statusColor,
      officer: loan.officer || 'Loan Officer'
    }));

    res.json(formattedLoans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan status
/*
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    // Update the status
    loan.status = status;

    // Set statusColor based on status
    switch (status) {
      case 'PENDING':
        loan.statusColor = 'pending';
        break;
      case 'APPROVED':
        loan.statusColor = 'approved';
        break;
      case 'REJECTED':
        loan.statusColor = 'rejected';
        break;
      case 'DISBURSED':
        loan.statusColor = 'disbursed';
        break;
    }

    await loan.save();

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    // Determine status color
    let statusColor;
    switch (status) {
      case 'PENDING': statusColor = 'pending'; break;
      case 'APPROVED': statusColor = 'approved'; break;
      case 'REJECTED': statusColor = 'rejected'; break;
      case 'DISBURSED': statusColor = 'disbursed'; break;
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { status, statusColor },
      { new: true, runValidators: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ success: false, error: 'Loan not found' });
    }

    res.json({
      success: true,
      data: updatedLoan
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single loan
exports.getLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        error: 'Loan not found'
      });
    }

    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error fetching loan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

*/