import mongoose from "mongoose";
import currencyCodes from 'currency-codes';

// Get all ISO 4217 currency codes
const allCurrencyCodes = currencyCodes.codes();

// Ensure INR and USD are at the top in UI (you can sort in frontend), but for schema:
const prioritized = ['INR', 'USD'];
const rest = allCurrencyCodes.filter(code => !prioritized.includes(code));
const sortedCurrencyList = [...prioritized, ...rest];

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subscription name is required"],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, "Subscription price is required"],
    min: [0, 'Price must be greater than or equal to 0']
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
    enum: {
      values: allCurrencyCodes,
      message: '{VALUE} is not a supported currency code'
    },
    default: 'INR'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  category: {
    type: String,
    required: [true, "Subscription category is required"]
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start date must be in the past',
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'Renewal date must be after start date',
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
}, { timestamps: true });

subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
