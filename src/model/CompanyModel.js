const mongoose = require("mongoose");


const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          const wordCount = v.trim().split(/\s+/).length;
          return wordCount >= 1 && wordCount <= 10;
        },
        message: "Company name must be between 1 and 10 words",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(
            v
          );
        },
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,       
    },
    address: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // URL
      default: "",
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },

    settings: {
      defaultRole: { type: String, default: "employee" },
      timeZone: { type: String, default: "UTC" },
      officeHours: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "18:00" },
      },
      features: { type: Map, of: mongoose.Schema.Types.Mixed }, // dynamic features enabled
    },

    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // future custom fields
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CompanySchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  next();
});

module.exports = mongoose.model("Company", CompanySchema);
