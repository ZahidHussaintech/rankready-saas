import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  BarChart3,
  Globe,
  FileText,
  ArrowRight,
  Check,
  Radar,
  Printer,
} from 'lucide-react';
import API from './api';

const CHECKLIST_ITEMS = [
  { key: 'canonicalFixed', label: 'Dynamic Canonical Tags & Clean Indexing' },
  { key: 'sitemapSubmitted', label: 'Open Graph & Sitemap Discovery Ready' },
  { key: 'schemaAdded', label: 'JSON-LD Structured Data (Rich Snippets)' },
  { key: 'webpCompressed', label: 'HTTPS SSL & Core Metadata Optimized' },
  { key: 'accessibilityPassed', label: 'HTML Lang, Viewport & Single H1 Hierarchy' },
];

// ==========================================
// 1. LANDING & AUTH PAGE (Public Entry)
// ==========================================
function AuthLandingPage({ user, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    agencyName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await API.post(endpoint, payload);
      localStorage.setItem('rankready_token', data.token);
      localStorage.setItem('rankready_user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              RR
            </span>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              RankReady <span className="text-emerald-700 font-semibold">Workspace</span>
            </span>
          </div>
          <a
            href="https://biztools.zahidhussainofficial.com"
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-emerald-700 px-3"
          >
            Free SEO Tools <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Built for SEO Consultants & Boutique Agencies
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Turn Technical Website Audits Into Approved Monthly Retainers.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Stop sending messy spreadsheets to UK, US, and Australian prospects. Run a live technical
            site scan, capture exact metadata & schema findings, and share a branded client report
            link or PDF in one click.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              'Live URL scanner extracts Title, Meta Description, H1 count, Canonical, Schema & TTFB',
              'Generate branded public audit links (/report/id) with 1-click PDF print export',
              'Calculate and organize monthly USD retainer pipeline across active accounts',
            ].map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  !isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Free Account
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isLogin ? 'Welcome back to your workspace' : 'Start your agency workspace'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isLogin
                  ? 'Enter your credentials to manage client audits and proposals.'
                  : 'Create unlimited client audit boards on the free starter tier.'}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="Zahid Hussain"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-agency" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Agency or Brand Name
                    </label>
                    <input
                      id="reg-agency"
                      type="text"
                      placeholder="BizTools Digital Studio"
                      value={form.agencyName}
                      onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@agency.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label htmlFor="auth-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password (min 6 characters)
                </label>
                <input
                  id="auth-pass"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Please wait...' : isLogin ? 'Open Workspace' : 'Create Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 2. AGENCY WORKSPACE DASHBOARD (Protected)
// ==========================================
function DashboardPage({ user, onLogout }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');

  const defaultFormState = {
    clientName: '',
    websiteUrl: '',
    targetMarket: 'United Kingdom',
    mobileSpeedScore: 60,
    monthlyRetainerUsd: 650,
    status: 'Draft',
    checks: {
      canonicalFixed: false,
      sitemapSubmitted: false,
      schemaAdded: false,
      webpCompressed: false,
      accessibilityPassed: false,
    },
    scanMetrics: {
      detectedTitle: '',
      detectedDescription: '',
      h1Count: 0,
      responseTimeMs: 0,
      isHttps: true,
    },
    executiveSummary:
      'Technical audit completed. Resolving canonical indexing, structured JSON-LD schema, and Core Web Vitals bottlenecks will unlock higher organic conversions.',
  };

  const [newClient, setNewClient] = useState(defaultFormState);

  const fetchWorkspaces = async () => {
    try {
      const { data } = await API.get('/workspaces');
      setWorkspaces(data);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleAutoScan = async () => {
    if (!newClient.websiteUrl.trim()) {
      setScanError('Please enter a website URL first (e.g. https://example.com).');
      return;
    }
    setScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      const { data } = await API.post('/workspaces/scan', { url: newClient.websiteUrl });
      setScanResult(data);
      setNewClient((prev) => ({
        ...prev,
        websiteUrl: data.scannedUrl,
        mobileSpeedScore: data.estimatedScore,
        checks: data.checks,
        scanMetrics: {
          detectedTitle: data.title,
          detectedDescription: data.metaDescription,
          h1Count: data.h1Count,
          responseTimeMs: data.responseTimeMs,
          isHttps: data.isHttps,
        },
        executiveSummary: data.executiveSummary,
      }));
    } catch (err) {
      setScanError(err.response?.data?.message || 'Scan failed. Check URL or enter metrics manually.');
    } finally {
      setScanning(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/workspaces', newClient);
      setWorkspaces([data, ...workspaces]);
      setShowForm(false);
      setScanResult(null);
      setScanError('');
      setNewClient(defaultFormState);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating client audit');
    }
  };

  const handleToggleCheck = async (ws, checkKey) => {
    const updatedChecks = { ...ws.checks, [checkKey]: !ws.checks?.[checkKey] };
    try {
      const { data } = await API.put(`/workspaces/${ws._id}`, { checks: updatedChecks });
      setWorkspaces(workspaces.map((item) => (item._id === ws._id ? data : item)));
    } catch (err) {
      alert('Failed to update checklist item');
    }
  };

  const handleStatusChange = async (ws, newStatus) => {
    try {
      const { data } = await API.put(`/workspaces/${ws._id}`, { status: newStatus });
      setWorkspaces(workspaces.map((item) => (item._id === ws._id ? data : item)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client audit workspace?')) return;
    try {
      await API.delete(`/workspaces/${id}`);
      setWorkspaces(workspaces.filter((w) => w._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const copyShareLink = (shareId) => {
    const url = `${window.location.origin}/report/${shareId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    setTimeout(() => setCopiedId(''), 2500);
  };

  const totalPipeline = workspaces.reduce((sum, w) => sum + (Number(w.monthlyRetainerUsd) || 0), 0);
  const approvedMrr = workspaces
    .filter((w) => w.status === 'Approved')
    .reduce((sum, w) => sum + (Number(w.monthlyRetainerUsd) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
              RR
            </span>
            <div>
              <span className="font-bold text-base sm:text-lg text-slate-900 block leading-none">
                RankReady
              </span>
              <span className="text-xs text-slate-500">{user.agencyName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-slate-600">
              Signed in as <strong className="text-slate-900">{user.name}</strong>
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Audits</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{workspaces.length}</p>
            <p className="text-xs text-slate-600 mt-1">Client domains tracked</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Proposed Retainer Pipeline
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              ${totalPipeline.toLocaleString()}/mo
            </p>
            <p className="text-xs text-slate-600 mt-1">Across all open proposals</p>
          </div>
          <div className="bg-white border border-emerald-200 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Approved Monthly Retainers
            </p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">
              ${approvedMrr.toLocaleString()}/mo
            </p>
            <p className="text-xs text-slate-600 mt-1">Signed recurring clients</p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Client Audit & Retainer Boards</h1>
            <p className="text-sm text-slate-600">
              Scan any live website URL, save technical evidence, and share a client-ready report link.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'New Client Audit'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white border border-slate-300 rounded-2xl p-6 space-y-5 shadow-xs"
          >
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Create New Client Technical Audit</h2>
              <p className="text-xs text-slate-600">
                Enter a URL and click <strong>Auto-Scan Live Site</strong> to capture deterministic SEO & metadata evidence.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label htmlFor="c-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Client / Company Name *
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  placeholder="e.g. Rose Garden Group"
                  value={newClient.clientName}
                  onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="md:col-span-5">
                <label htmlFor="c-url" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Website URL *
                </label>
                <input
                  id="c-url"
                  type="text"
                  required
                  placeholder="https://example.co.uk"
                  value={newClient.websiteUrl}
                  onChange={(e) => setNewClient({ ...newClient, websiteUrl: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={handleAutoScan}
                  disabled={scanning}
                  className="w-full min-h-[44px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
                >
                  <Radar className={`w-4 h-4 text-emerald-400 ${scanning ? 'animate-spin' : ''}`} />
                  {scanning ? 'Scanning Site...' : 'Auto-Scan Live Site'}
                </button>
              </div>
            </div>

            {scanError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm"
              >
                {scanError}
              </div>
            )}

            {scanResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs sm:text-sm text-emerald-950">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-emerald-900">
                    Live Scan Complete — {scanResult.responseTimeMs}ms server TTFB
                  </p>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-xs font-bold">
                    On-Page Audit Score: {scanResult.estimatedScore}/100
                  </span>
                </div>
                <p>
                  <strong>Detected Title ({scanResult.title.length} chars):</strong>{' '}
                  {scanResult.title || 'Missing <title> tag'}
                </p>
                <p>
                  <strong>Meta Description ({scanResult.metaDescription.length} chars):</strong>{' '}
                  {scanResult.metaDescription || 'Missing meta description'}
                </p>
                <p>
                  <strong>H1 Tags Found:</strong> {scanResult.h1Count} •{' '}
                  <strong>Canonical:</strong> {scanResult.checks.canonicalFixed ? 'Yes' : 'Missing'} •{' '}
                  <strong>JSON-LD Schema:</strong> {scanResult.checks.schemaAdded ? 'Yes' : 'Missing'}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="c-market" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Region
                </label>
                <select
                  id="c-market"
                  value={newClient.targetMarket}
                  onChange={(e) => setNewClient({ ...newClient, targetMarket: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Australia & NZ</option>
                  <option>Europe (EU)</option>
                  <option>Global / Multi-Region</option>
                </select>
              </div>

              <div>
                <label htmlFor="c-speed" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  On-Page Score (0–100)
                </label>
                <input
                  id="c-speed"
                  type="number"
                  min="0"
                  max="100"
                  value={newClient.mobileSpeedScore}
                  onChange={(e) =>
                    setNewClient({ ...newClient, mobileSpeedScore: Number(e.target.value) })
                  }
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label htmlFor="c-retainer" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Proposed Monthly Retainer (USD $)
                </label>
                <input
                  id="c-retainer"
                  type="number"
                  min="0"
                  value={newClient.monthlyRetainerUsd}
                  onChange={(e) =>
                    setNewClient({ ...newClient, monthlyRetainerUsd: Number(e.target.value) })
                  }
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label htmlFor="c-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Proposal Status
                </label>
                <select
                  id="c-status"
                  value={newClient.status}
                  onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent to Client">Sent to Client</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="c-summary" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Executive Audit Summary (Shown on Public Client Report)
              </label>
              <textarea
                id="c-summary"
                rows={3}
                value={newClient.executiveSummary}
                onChange={(e) => setNewClient({ ...newClient, executiveSummary: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="min-h-[44px] px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold cursor-pointer"
              >
                Save Client Workspace
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-slate-600">Loading your client workspaces...</p>
        ) : workspaces.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
            <BarChart3 className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">No client audits yet</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Click <strong>"New Client Audit"</strong> above, scan any live website URL, and
              generate a shareable audit report link.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {workspaces.map((ws) => {
              const completedCount = CHECKLIST_ITEMS.filter((item) => ws.checks?.[item.key]).length;
              return (
                <article
                  key={ws._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-2xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          {ws.targetMarket}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-2">{ws.clientName}</h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 break-all">
                          <Globe className="w-3.5 h-3.5 shrink-0" /> {ws.websiteUrl}
                        </p>
                      </div>

                      <div className="text-right">
                        <label htmlFor={`status-${ws._id}`} className="sr-only">
                          Proposal Status
                        </label>
                        <select
                          id={`status-${ws._id}`}
                          value={ws.status}
                          onChange={(e) => handleStatusChange(ws, e.target.value)}
                          className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-800"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent to Client">Sent to Client</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <div>
                        <p className="text-[11px] font-medium text-slate-500">Audit Score</p>
                        <p
                          className={`text-base font-extrabold ${
                            ws.mobileSpeedScore >= 85
                              ? 'text-emerald-700'
                              : ws.mobileSpeedScore >= 50
                              ? 'text-amber-700'
                              : 'text-red-700'
                          }`}
                        >
                          {ws.mobileSpeedScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-slate-500">Passed Checks</p>
                        <p className="text-base font-extrabold text-slate-900">
                          {completedCount}/{CHECKLIST_ITEMS.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-slate-500">Retainer</p>
                        <p className="text-base font-extrabold text-emerald-700">
                          ${ws.monthlyRetainerUsd}/mo
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Technical Readiness Checklist (Click to toggle)
                      </p>
                      {CHECKLIST_ITEMS.map((item) => {
                        const checked = Boolean(ws.checks?.[item.key]);
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleToggleCheck(ws, item.key)}
                            className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-2.5 text-left text-xs sm:text-sm transition cursor-pointer"
                          >
                            {checked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className={checked ? 'line-through text-slate-500' : 'text-slate-800'}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyShareLink(ws.shareId)}
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        {copiedId === ws.shareId ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" /> Link Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Client Link
                          </>
                        )}
                      </button>

                      <Link
                        to={`/report/${ws.shareId}`}
                        target="_blank"
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800"
                      >
                        <FileText className="w-4 h-4" /> Preview Report
                      </Link>
                    </div>

                    <button
                      type="button"
                      aria-label={`Delete ${ws.clientName}`}
                      onClick={() => handleDelete(ws._id)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 3. PUBLIC CLIENT REPORT PAGE (/report/:shareId)
// ==========================================
function PublicReportPage() {
  const { shareId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/workspaces/public/${shareId}`)
      .then((res) => setReport(res.data))
      .catch(() => setError('This client audit report could not be found.'));
  }, [shareId]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Report Unavailable</h1>
        <p className="text-sm text-slate-600">{error}</p>
        <Link to="/" className="min-h-[44px] inline-flex items-center text-emerald-700 font-semibold underline">
          Go to RankReady Workspace
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Loading technical audit report...
      </div>
    );
  }

  const completedCount = CHECKLIST_ITEMS.filter((item) => report.checks?.[item.key]).length;
  const hasScanEvidence =
    report.scanMetrics &&
    (report.scanMetrics.detectedTitle ||
      report.scanMetrics.detectedDescription ||
      report.scanMetrics.responseTimeMs > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mb-4 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      <article className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-10 space-y-8">
        <header className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Technical SEO & Core Web Vitals Audit
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {report.clientName}
            </h1>
            <p className="text-sm text-slate-600 mt-1 break-all">
              Domain: <strong>{report.websiteUrl}</strong> • Market: {report.targetMarket}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left sm:text-right">
            <p className="text-xs text-slate-500">Prepared By</p>
            <p className="text-sm font-bold text-slate-900">
              {report.user?.agencyName || 'RankReady Consultant'}
            </p>
            <p className="text-xs text-slate-600">{report.user?.name}</p>
          </div>
        </header>

        <section className="grid sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">On-Page Audit Score</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {report.mobileSpeedScore} / 100
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500">Technical Benchmarks Passed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {completedCount} of {CHECKLIST_ITEMS.length}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-800">Recommended Retainer</p>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1">
              ${report.monthlyRetainerUsd}/mo
            </p>
          </div>
        </section>

        {hasScanEvidence && (
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2.5 text-xs sm:text-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Live Site Inspection Evidence
            </h2>
            <p>
              <strong>Page Title ({report.scanMetrics.detectedTitle?.length || 0} chars):</strong>{' '}
              {report.scanMetrics.detectedTitle || 'Missing <title> tag'}
            </p>
            <p>
              <strong>
                Meta Description ({report.scanMetrics.detectedDescription?.length || 0} chars):
              </strong>{' '}
              {report.scanMetrics.detectedDescription || 'Missing meta description'}
            </p>
            <p>
              <strong>H1 Heading Count:</strong> {report.scanMetrics.h1Count} •{' '}
              <strong>Server Response (TTFB):</strong> {report.scanMetrics.responseTimeMs}ms •{' '}
              <strong>SSL HTTPS:</strong> {report.scanMetrics.isHttps ? 'Active' : 'Missing'}
            </p>
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Executive Summary & Action Plan</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {report.executiveSummary}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5-Point Technical Readiness Breakdown</h2>
          <div className="space-y-2">
            {CHECKLIST_ITEMS.map((item) => {
              const passed = Boolean(report.checks?.[item.key]);
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold shrink-0 ${
                      passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {passed ? 'Passed' : 'Action Needed'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Status: <strong className="text-slate-800">{report.status}</strong> • Powered by RankReady Workspace
          </p>
          {report.user?.email && (
            <a
              href={`mailto:${report.user.email}?subject=Re: Technical SEO Audit for ${report.clientName}`}
              className="min-h-[44px] inline-flex items-center px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold print:hidden"
            >
              Approve & Reply via Email
            </a>
          )}
        </footer>
      </article>
    </div>
  );
}

// ==========================================
// MAIN APP ROUTER
// ==========================================
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rankready_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('rankready_token');
    localStorage.removeItem('rankready_user');
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<AuthLandingPage user={user} onAuthSuccess={setUser} />} />
      <Route
        path="/dashboard"
        element={
          user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      />
      <Route path="/report/:shareId" element={<PublicReportPage />} />
    </Routes>
  );
}