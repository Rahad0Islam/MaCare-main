import mongoose from "mongoose";

const WeightTrackingSchema = new mongoose.Schema({
    motherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    pregnancyWeek: {
        type: Number,
        min: 0,
        max: 42
    },
    weight: {
        type: Number, // Weight in kg
        required: true,
        min: 0
    },
    height: {
        type: Number, // Height in cm
        min: 0
    },
    bmi: {
        type: Number,
        min: 0
    },
    notes: {
        type: String,
        maxlength: 500
    },
    recordedBy: {
        type: String,
        enum: ['mother', 'midwife', 'doctor'],
        default: 'mother'
    }
}, {
    timestamps: true
});

// Index for efficient querying
WeightTrackingSchema.index({ motherID: 1, date: -1 });

// Calculate BMI before saving
WeightTrackingSchema.pre('save', function(next) {
    if (this.weight && this.height) {
        const heightInMeters = this.height / 100;
        this.bmi = this.weight / (heightInMeters * heightInMeters);
        this.bmi = Math.round(this.bmi * 10) / 10; // Round to 1 decimal
    }
    next();
});

// Virtual for weight change from previous entry
WeightTrackingSchema.methods.getWeightChange = async function() {
    const previousEntry = await this.constructor.findOne({
        motherID: this.motherID,
        date: { $lt: this.date }
    }).sort({ date: -1 });
    
    if (previousEntry) {
        return this.weight - previousEntry.weight;
    }
    return 0;
};

export const WeightTracking = mongoose.model("WeightTracking", WeightTrackingSchema);
