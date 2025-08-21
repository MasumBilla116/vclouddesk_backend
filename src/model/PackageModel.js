const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    durationInDays: {
      type: Number,
      required: true, 
    },    
    features: [
      {
        key: { type: String, required: true }, // e.g., "maxUsers", "maxStorage", "videoCallHours"
        label: { type: String }, // Human readable e.g., "Maximum Users"
        value: { type: mongoose.Schema.Types.Mixed }, // can store number, string, boolean etc.
        unit: { type: String }, // e.g., "GB", "Hours", "Users"
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
