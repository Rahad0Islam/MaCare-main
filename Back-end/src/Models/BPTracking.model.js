import mongoose, { Schema } from "mongoose";

const bpTrackingSchema = new Schema(
  {
    motherID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    systolic: {
      type: Number,
      required: true,
      min: 70,
      max: 250
    },
    diastolic: {
      type: Number,
      required: true,
      min: 40,
      max: 180
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['normal', 'elevated', 'high-stage1', 'high-stage2', 'crisis'],
      required: true
    },
    pregnancyWeek: {
      type: Number,
      min: 0,
      max: 42
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
bpTrackingSchema.index({ motherID: 1, date: -1 });

// Method to determine BP status
bpTrackingSchema.statics.getBPStatus = function(systolic, diastolic) {
  if (systolic >= 180 || diastolic >= 120) {
    return 'crisis';
  } else if (systolic >= 140 || diastolic >= 90) {
    return 'high-stage2';
  } else if (systolic >= 130 || diastolic >= 80) {
    return 'high-stage1';
  } else if (systolic >= 120 && diastolic < 80) {
    return 'elevated';
  } else {
    return 'normal';
  }
};

// Method to get status label in Bengali
bpTrackingSchema.methods.getStatusLabel = function() {
  const statusLabels = {
    'normal': 'স্বাভাবিক',
    'elevated': 'সতর্কতা',
    'high-stage1': 'উচ্চ (পর্যায় ১)',
    'high-stage2': 'উচ্চ (পর্যায় ২)',
    'crisis': 'জরুরি অবস্থা'
  };
  return statusLabels[this.status] || this.status;
};

export const BPTracking = mongoose.model("BPTracking", bpTrackingSchema);
