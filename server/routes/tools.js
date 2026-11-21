import express from 'express';
import jwt from 'jsonwebtoken';
import SeoToolData from '../models/SeoToolData.js';

const router = express.Router();

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id || decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

async function getOrCreateToolDoc(userId) {
  let doc = await SeoToolData.findOne({ userId });
  if (!doc) {
    doc = await SeoToolData.create({
      userId,
      keywords: [
        { keyword: 'technical seo agency uk', targetUrl: '/technical-seo', volume: 2400, difficulty: 34, position: 4, change: 3 },
        { keyword: 'wordpress speed optimization service', targetUrl: '/speed-optimization', volume: 1900, difficulty: 29, position: 6, change: 2 },
        { keyword: 'b2b lead generation website design', targetUrl: '/', volume: 1450, difficulty: 38, position: 9, change: 4 },
      ],
      backlinks: [
        { referringDomain: 'clutch.co', anchorText: 'Zahid Hussain Technical SEO', domainRating: 89, linkType: 'Dofollow', status: 'Active' },
        { referringDomain: 'goodfirms.co', anchorText: 'RankReady SEO Audit', domainRating: 82, linkType: 'Dofollow', status: 'New' },
        { referringDomain: 'linkedin.com', anchorText: 'zahidhussainofficial.com', domainRating: 98, linkType: 'Nofollow', status: 'Active' },
      ],
      monitors: [
        { domain: 'https://zahidhussainofficial.com', status: 'Online', statusCode: 200, responseTimeMs: 142, hasHttps: true, hasRobots: true, hasSitemap: true },
        { domain: 'https://app.zahidhussainofficial.com', status: 'Online', statusCode: 200, responseTimeMs: 118, hasHttps: true, hasRobots: true, hasSitemap: true },
        { domain: 'https://biztools.zahidhussainofficial.com', status: 'Online', statusCode: 200, responseTimeMs: 156, hasHttps: true, hasRobots: true, hasSitemap: true },
      ],
    });
  }
  return doc;
}

// GET all tools data
router.get('/', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateToolDoc(req.userId);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load SEO tools data.' });
  }
});

// ADD keyword
router.post('/keywords', requireAuth, async (req, res) => {
  try {
    const { keyword, targetUrl, volume, difficulty, position } = req.body;
    if (!keyword) return res.status(400).json({ message: 'Keyword is required.' });
    const doc = await getOrCreateToolDoc(req.userId);
    doc.keywords.unshift({
      keyword: keyword.trim(),
      targetUrl: (targetUrl || '/').trim(),
      volume: Number(volume) || 1000,
      difficulty: Number(difficulty) || 30,
      position: Number(position) || 12,
      change: 1,
    });
    await doc.save();
    res.json(doc.keywords);
  } catch {
    res.status(500).json({ message: 'Could not add keyword.' });
  }
});

// DELETE keyword
router.delete('/keywords/:id', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateToolDoc(req.userId);
    doc.keywords = doc.keywords.filter((k) => String(k._id) !== req.params.id);
    await doc.save();
    res.json(doc.keywords);
  } catch {
    res.status(500).json({ message: 'Could not delete keyword.' });
  }
});

// ADD backlink
router.post('/backlinks', requireAuth, async (req, res) => {
  try {
    const { referringDomain, anchorText, domainRating, linkType } = req.body;
    if (!referringDomain) return res.status(400).json({ message: 'Referring domain is required.' });
    const doc = await getOrCreateToolDoc(req.userId);
    doc.backlinks.unshift({
      referringDomain: referringDomain.trim().replace(/^https?:\/\//, ''),
      anchorText: (anchorText || 'Brand Mention').trim(),
      domainRating: Number(domainRating) || 45,
      linkType: linkType === 'Nofollow' ? 'Nofollow' : 'Dofollow',
      status: 'New',
    });
    await doc.save();
    res.json(doc.backlinks);
  } catch {
    res.status(500).json({ message: 'Could not add backlink.' });
  }
});

// DELETE backlink
router.delete('/backlinks/:id', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateToolDoc(req.userId);
    doc.backlinks = doc.backlinks.filter((b) => String(b._id) !== req.params.id);
    await doc.save();
    res.json(doc.backlinks);
  } catch {
    res.status(500).json({ message: 'Could not delete backlink.' });
  }
});

// LIVE SITE MONITOR PING (Real HTTP + robots.txt + sitemap.xml check)
router.post('/monitor', requireAuth, async (req, res) => {
  try {
    let { domain } = req.body;
    if (!domain) return res.status(400).json({ message: 'Domain URL is required.' });
    if (!/^https?:\/\//i.test(domain)) domain = `https://${domain}`;
    const cleanUrl = domain.replace(/\/+$/, '');

    const start = Date.now();
    let statusCode = 0;
    let status = 'Offline';
    try {
      const resp = await fetch(cleanUrl, { method: 'GET', redirect: 'follow' });
      statusCode = resp.status;
      status = resp.ok ? 'Online' : `HTTP ${resp.status}`;
    } catch {
      status = 'Unreachable';
    }
    const responseTimeMs = Date.now() - start;

    let hasRobots = false;
    let hasSitemap = false;
    try {
      const r = await fetch(`${cleanUrl}/robots.txt`);
      hasRobots = r.ok;
    } catch {}
    try {
      const s = await fetch(`${cleanUrl}/sitemap.xml`);
      hasSitemap = s.ok;
    } catch {}

    const doc = await getOrCreateToolDoc(req.userId);
    const existingIdx = doc.monitors.findIndex((m) => m.domain.toLowerCase() === cleanUrl.toLowerCase());
    const entry = {
      domain: cleanUrl,
      status,
      statusCode,
      responseTimeMs,
      hasHttps: cleanUrl.startsWith('https://'),
      hasRobots,
      hasSitemap,
      lastChecked: new Date(),
    };

    if (existingIdx >= 0) {
      doc.monitors[existingIdx] = entry;
    } else {
      doc.monitors.unshift(entry);
    }
    await doc.save();
    res.json(doc.monitors);
  } catch {
    res.status(500).json({ message: 'Site monitoring check failed.' });
  }
});

export default router;
