const Loan = require('../models/Loan');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total loans
    const totalLoans = await Loan.countDocuments();

    // Active users (unique borrowers)
    const activeUsers = await Loan.distinct('fullName').countDocuments();

    // Total borrowers (users with at least one loan)
    const borrowers = await Loan.distinct('fullName').countDocuments();

    // Total cash disbursed (sum of all approved loans)
    const disbursedLoans = await Loan.find({ status: 'DISBURSED' });
    const cashDisbursed = disbursedLoans.reduce((total, loan) => total + loan.loanAmount, 0);

    // Cash received (placeholder for now - in a real system this would be calculated from repayments)
    // For demo purposes, we'll use a formula: 60% of all approved loans plus a fixed amount
    const approvedLoans = await Loan.find({ status: 'APPROVED' });
    const approvedTotal = approvedLoans.reduce((total, loan) => total + loan.loanAmount, 0);
    const cashReceived = Math.round(approvedTotal * 0.6) + 500000; // 60% + 500k for demo

    // Savings (difference between received and disbursed)
    const savings = cashReceived - cashDisbursed;

    // Rapid loans (loans with tenure <= 3 months)
    const rapidLoans = await Loan.countDocuments({ loanTenure: { $lte: 3 } });

    // Other accounts (placeholder for demo)
    const otherAccounts = Math.round(borrowers * 0.2); // 20% of borrowers for demo

    // Recent loans
    const recentLoans = await Loan.find()
      .sort({ dateApplied: -1 })
      .limit(10)
      .lean();

    const formattedRecentLoans = recentLoans.map(loan => ({
      id: loan._id,
      name: loan.fullName,
      amount: `$${loan.loanAmount.toLocaleString()}`,
      status: loan.status.charAt(0) + loan.status.slice(1).toLowerCase(),
      date: new Date(loan.dateApplied).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    res.json({
      activeUsers,
      borrowers,
      cashDisbursed,
      cashReceived,
      savings,
      rapidLoans,
      otherAccounts,
      totalLoans,
      recentLoans: formattedRecentLoans
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
