const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "otp", 
            "forgot_password", 
            "mail_verification", 
            "account_verification"
        ],
        required: true,
    },
    target: {
        type: String, 
        required: true,  
    },
    code: {
        type: String, 
        required: true, 
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

// Auto-delete expired records (optional)
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Verification", VerificationSchema);
