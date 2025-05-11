const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [0, 'Loan amount must be positive']
  },
  loanTenure: {
    type: Number,
    required: [true, 'Loan tenure is required'],
    min: [1, 'Loan tenure must be at least 1 month'],
    validate: {
      validator: Number.isInteger,
      message: 'Loan tenure must be an integer'
    }
  },
  employmentStatus: {
    type: String,
    required: [true, 'Employment status is required'],
    trim: true
  },
  reasonForLoan: {
    type: String,
    required: [true, 'Reason for loan is required'],
    trim: true
  },
  employerAddress: {
    type: String,
    required: [true, 'Employer address is required'],
    trim: true
  },
  dateApplied: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting in getLoans
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'],
      message: '{VALUE} is not a valid status'
    },
    default: 'PENDING',
    uppercase: true, // Ensure status is stored in uppercase
    index: true // Index for filtering in VerifierDashboard
  },
  officer: {
    type: String,
    default: 'Loan Officer',
    trim: true
  },
  statusColor: {
    type: String,
    default: 'pending'
  }
});

// Pre-save middleware to set statusColor based on status
loanSchema.pre('save', function (next) {
  this.status = this.status.toUpperCase(); // Normalize status to uppercase
  switch (this.status) {
    case 'PENDING':
      this.statusColor = 'pending';
      break;
    case 'APPROVED':
      this.statusColor = 'approved';
      break;
    case 'REJECTED':
      this.statusColor = 'rejected';
      break;
    case 'DISBURSED':
      this.statusColor = 'disbursed';
      break;
    default:
      this.statusColor = 'pending';
  }
  next();
});

// Pre-update middleware to set statusColor for updates
loanSchema.pre(['updateOne', 'findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  const update = this.getUpdate();
  if (update.status) {
    update.status = update.status.toUpperCase(); // Normalize status to uppercase
    switch (update.status) {
      case 'PENDING':
        update.statusColor = 'pending';
        break;
      case 'APPROVED':
        update.statusColor = 'approved';
        break;
      case 'REJECTED':
        update.statusColor = 'rejected';
        break;
      case 'DISBURSED':
        update.statusColor = 'disbursed';
        break;
      default:
        update.statusColor = 'pending';
    }
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);


/*const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  loanTenure: {
    type: Number,
    required: true
  },
  employmentStatus: {
    type: String,
    required: true
  },
  reasonForLoan: {
    type: String,
    required: true
  },
  employerAddress: {
    type: String,
    required: true
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'],
    default: 'PENDING'
  },
  officer: {
    type: String,
    default: 'Loan Officer'
  },
  statusColor: {
    type: String,
    default: 'pending'
  }
});

// Pre-save middleware to set statusColor based on status
loanSchema.pre('save', function (next) {
  switch (this.status) {
    case 'PENDING':
      this.statusColor = 'pending';
      break;
    case 'APPROVED':
      this.statusColor = 'approved';
      break;
    case 'REJECTED':
      this.statusColor = 'rejected';
      break;
    case 'DISBURSED':
      this.statusColor = 'disbursed';
      break;
    default:
      this.statusColor = 'pending';
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
*/