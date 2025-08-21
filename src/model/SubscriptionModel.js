const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin/owner who purchased subscription
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "expired", "trial"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    renewal: {
      autoRenew: { type: Boolean, default: true },
      nextBillingDate: { type: Date },
      billingCycle: {
        type: String,
        enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "custom"],
        default: "monthly",
      },
      customDurationDays: { type: Number }, // if billingCycle = custom
    },
    payment: {
      amount: { type: Number, required: true },      
      currency: { type: String, default: "USD" },
      method: { type: String, enum: ["bkash","rocket","nagad","sslcommerze","card", "paypal", "bank", "crypto", "other"] },
      transactionId: { type: String },
      paidAt: { type: Date },
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      value: {
        type: Number,
        default: 0,
      },
      promoCode: {
        type: String,
        default: null,
      },
    },
    usage: {
       type: Map,
       of: mongoose.Schema.Types.Mixed, // usage for each feature key dynamically
       default:{}
    },
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // for any future dynamic fields
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
