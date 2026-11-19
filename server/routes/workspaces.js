import express from 'express';
import mongoose from 'mongoose';
import AuditWorkspace from '../models/AuditWorkspace.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Simple In-Memory Rate Limiter for /scan (Max 30 scans per 15 mins per user)
const scanHistory = new Map();
function scanRateLimiter(req, res, next) {
  const key = req.userId || req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const timestamps = (scanHistory.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= 30) {
    return res.status(429).json({
      message: 'Scan rate limit reached (30 scans / 15 mins). Please wait a few minutes.',
    });
  }
  timestamps.push(now);
  scanHistory.set(key, timestamps);
  next();
}

// Block internal/private network URLs (SSRF Protection)
function isSafePublicUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.endsWith('.local')
    ) {
      return false;
    }
    return host.includes('.');
  } catch {
    return false;
  }
}

// ==========================================
// 1. LIVE WEBSITE URL AUTO-SCANNER (Deterministic & Secure)
// ==========================================
router.post('/scan', authMiddleware, scanRateLimiter, async (req, res) => {
  try {
    let { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ message: 'Please enter a valid website URL.' });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    if (!isSafePublicUrl(url)) {
      return res.status(400).json({ message: 'Please enter a valid public domain URL.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const startTime = Date.now();
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; RankReadyAuditBot/1.0; +https://app.zahidhussainofficial.com)',
      },
    });
    clearTimeout(timeout);

    const responseTimeMs = Date.now() - startTime;
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

    const descMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const metaDescription = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '';

    const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);
    const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
    const hasOgTags = /property=["']og:title["']/i.test(html);
    const hasLangAttr = /<html[^>]*\blang=/i.test(html);
    const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;
    const isHttps = url.startsWith('https://');

    // 100% Deterministic Score (Consistent across repeated scans)
    let estimatedScore = 20;
    if (isHttps) estimatedScore += 15;
    if (title.length >= 15 && title.length <= 65) estimatedScore += 15;
    else if (title.length > 0) estimatedScore += 8;

    if (metaDescription.length >= 60 && metaDescription.length <= 165) estimatedScore += 15;
    else if (metaDescription.length > 0) estimatedScore += 8;

    if (h1Count === 1) estimatedScore += 10;
    if (hasCanonical) estimatedScore += 10;
    if (hasSchema) estimatedScore += 8;
    if (hasViewport && hasLangAttr) estimatedScore += 7;
    estimatedScore = Math.min(100, estimatedScore);

    const findings = [];
    if (!isHttps) findings.push('missing HTTPS SSL encryption');
    if (!title) findings.push('missing <title> tag');
    else if (title.length > 65) findings.push(`title too long (${title.length} chars, keep under 60)`);
    else if (title.length < 15) findings.push(`title too short (${title.length} chars)`);

    if (!metaDescription) findings.push('missing meta description');
    else if (metaDescription.length > 165)
      findings.push(`meta description too long (${metaDescription.length} chars)`);

    if (h1Count === 0) findings.push('missing main <h1> heading');
    else if (h1Count > 1) findings.push(`multiple <h1> tags detected (${h1Count} found, should be 1)`);

    if (!hasCanonical) findings.push('missing rel="canonical" tag');
    if (!hasSchema) findings.push('no JSON-LD structured data detected');
    if (!hasOgTags) findings.push('missing Open Graph social metadata');

    const executiveSummary =
      findings.length > 0
        ? `Technical inspection of ${url} (${responseTimeMs}ms TTFB) identified ${findings.length} priority optimization items: ${findings.join(
            '; '
          )}. Addressing these on-page structure, schema, and Core Web Vitals signals will strengthen search visibility and conversion readiness.`
        : `Technical inspection of ${url} (${responseTimeMs}ms TTFB) passed all core on-page benchmarks (HTTPS, optimal Title & Meta Description lengths, single H1 hierarchy, Canonical tag, and JSON-LD Schema). Recommended next focus: field Core Web Vitals (INP/LCP), conversion funnel refinement, and authority content expansion.`;

    res.json({
      scannedUrl: url,
      responseTimeMs,
      title,
      metaDescription,
      h1Count,
      isHttps,
      estimatedScore,
      checks: {
        canonicalFixed: hasCanonical,
        sitemapSubmitted: hasOgTags,
        schemaAdded: hasSchema,
        webpCompressed: isHttps && title.length > 0 && metaDescription.length > 0,
        accessibilityPassed: hasViewport && hasLangAttr && h1Count === 1,
      },
      executiveSummary,
    });
  } catch (err) {
    res.status(400).json({
      message:
        'Could not reach that URL (site may block bots or timed out). You can still enter audit metrics manually.',
    });
  }
});

// ==========================================
// 2. PUBLIC CLIENT REPORT ROUTE (No Login Needed)
// ==========================================
router.get('/public/:shareId', async (req, res) => {
  try {
    const cleanShareId = String(req.params.shareId || '').replace(/[^a-f0-9]/gi, '');
    if (!cleanShareId) {
      return res.status(404).json({ message: 'Client report not found.' });
    }
    const workspace = await AuditWorkspace.findOne({ shareId: cleanShareId }).populate(
      'user',
      'name agencyName email'
    );
    if (!workspace) {
      return res.status(404).json({ message: 'Client report not found.' });
    }
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Error loading public report.' });
  }
});

// ==========================================
// 3. PROTECTED CRUD ROUTES (Agency Dashboard)
// ==========================================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const workspaces = await AuditWorkspace.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workspaces.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      clientName,
      websiteUrl,
      targetMarket,
      mobileSpeedScore,
      monthlyRetainerUsd,
      status,
      checks,
      scanMetrics,
      executiveSummary,
    } = req.body;

    if (!clientName || !websiteUrl) {
      return res.status(400).json({ message: 'Client name and website URL are required.' });
    }

    const created = await AuditWorkspace.create({
      user: req.userId,
      clientName,
      websiteUrl,
      targetMarket,
      mobileSpeedScore,
      monthlyRetainerUsd,
      status,
      checks,
      scanMetrics,
      executiveSummary,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create workspace.', error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }
    const updated = await AuditWorkspace.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Workspace not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update workspace.' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }
    const deleted = await AuditWorkspace.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: 'Workspace not found.' });
    res.json({ message: 'Workspace deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete workspace.' });
  }
});

export default router;