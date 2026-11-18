import mongoose from 'mongoose';
import crypto from 'crypto';

const auditWorkspaceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shareId: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(6).toString('hex'),
    },
    clientName: { type: String, required: true, trim: true },
    websiteUrl: { type: String, required: true, trim: true },
    targetMarket: { type: String, default: 'United Kingdom' },
    mobileSpeedScore: { type: Number, default: 60, min: 0, max: 100 },
    monthlyRetainerUsd: { type: Number, default: 650, min: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Sent to Client', 'Approved'],
      default: 'Draft',
    },
    checks: {
      canonicalFixed: { type: Boolean, default: false },
      sitemapSubmitted: { type: Boolean, default: false },
      schemaAdded: { type: Boolean, default: false },
      webpCompressed: { type: Boolean, default: false },
      accessibilityPassed: { type: Boolean, default: false },
    },
    scanMetrics: {
      detectedTitle: { type: String, default: '' },
      detectedDescription: { type: String, default: '' },
      h1Count: { type: Number, default: 0 },
      responseTimeMs: { type: Number, default: 0 },
      isHttps: { type: Boolean, default: true },
    },
    executiveSummary: {
      type: String,
      default:
        'Technical audit completed. Resolving mobile Core Web Vitals, structured data, and canonical indexing bottlenecks will unlock higher organic conversions.',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AuditWorkspace', auditWorkspaceSchema);