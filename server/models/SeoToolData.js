import mongoose from 'mongoose';

const keywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true, trim: true },
  targetUrl: { type: String, default: '/', trim: true },
  volume: { type: Number, default: 1200 },
  difficulty: { type: Number, default: 32 },
  position: { type: Number, default: 8 },
  change: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
});

const backlinkSchema = new mongoose.Schema({
  referringDomain: { type: String, required: true, trim: true },
  anchorText: { type: String, default: 'Technical SEO Services', trim: true },
  domainRating: { type: Number, default: 48 },
  linkType: { type: String, enum: ['Dofollow', 'Nofollow'], default: 'Dofollow' },
  status: { type: String, enum: ['Active', 'New', 'Lost'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

const monitorSchema = new mongoose.Schema({
  domain: { type: String, required: true, trim: true },
  status: { type: String, default: 'Online' },
  statusCode: { type: Number, default: 200 },
  responseTimeMs: { type: Number, default: 185 },
  hasHttps: { type: Boolean, default: true },
  hasRobots: { type: Boolean, default: true },
  hasSitemap: { type: Boolean, default: true },
  lastChecked: { type: Date, default: Date.now },
});

const seoToolDataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    keywords: [keywordSchema],
    backlinks: [backlinkSchema],
    monitors: [monitorSchema],
  },
  { timestamps: true }
);

export default mongoose.model('SeoToolData', seoToolDataSchema);
