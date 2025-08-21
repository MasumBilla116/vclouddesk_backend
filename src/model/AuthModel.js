const mongoose = require("mongoose"); 
const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.length >= 3;
        },
        message: "Name must be take 3 charecters",
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // reference to the company
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin","owner", "admin", "manager", "employee"],
      default: "employee",
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy", "away"],
      default: "offline",
    },
    socketId: {
      type: String, // track real-time connections
      default: null,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },

    settings: {
      darkMode: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
      meta: { type: Map, of: mongoose.Schema.Types.Mixed },
    },
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // future custom fields
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AuthSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  next();
});

module.exports = mongoose.model("User", AuthSchema);
