const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    subdomain: {
      type: String,
      index: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    country: {
      type: String,
      default: 'Unknown',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

analyticsEventSchema.index({ profileId: 1, createdAt: -1 });
analyticsEventSchema.index({ profileId: 1, country: 1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
