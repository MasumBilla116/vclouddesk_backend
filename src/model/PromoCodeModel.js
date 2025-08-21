const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
    appliesTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Package", // if empty, applies to all packages
      default: [],
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    }, 
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // for dynamic custom fields
    },
  },
  { timestamps: true }
);

// Pre-save hook to automatically set status if expired
PromoCodeSchema.pre("save", function (next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("PromoCode", PromoCodeSchema);
