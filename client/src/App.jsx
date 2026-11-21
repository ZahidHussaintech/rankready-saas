import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle2, ExternalLink, Printer, ArrowRight, Sparkles } from 'lucide-react';
import API from './api';
import ExecutiveDashboard, {
  RankReadyLogo,
  SemiCircleAuditGauge,
  CHECKLIST_ITEMS,
} from './components/ExecutiveDashboard';

function AuthLandingPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [form, setForm] = useState({ name: '', agencyName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
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
      setError(err.response?.data?.message || 'Unable to connect to server. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', {
        email: form.email,
        agencyName: form.agencyName,
        newPassword: form.password,
      });
      setResetSuccess(data.message);
      setIsResetMode(false);
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col justify-between">
      <header className="border-b border-[#222222] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <RankReadyLogo />
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <a
              href="https://biztools.zahidhussainofficial.com/"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-[#efc325] transition flex items-center gap-1"
            >
              Free SEO Calculators <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://zahidhussainofficial.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex text-neutral-400 hover:text-white transition"
            >
              Agency Portfolio
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#efc325]/10 border border-[#efc325]/30 text-[#efc325] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Automated Technical SEO & Client Retainer Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Turn Live Website Audits Into{' '}
            <span className="text-[#efc325]">Approved Monthly Retainers.</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Run deterministic technical SEO audits, monitor Core Web Vitals, track keyword
            rankings, and share branded executive reports with UK, US, UAE, and Canadian clients.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#121212] border border-[#efc325]/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {!isResetMode && (
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0a0a0a] border border-[#222222] mb-6">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition cursor-pointer ${
                    isLogin ? 'bg-[#efc325] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition cursor-pointer ${
                    !isLogin ? 'bg-[#efc325] text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create Free Account
                </button>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                {resetSuccess}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            {isResetMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Registered Work Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Registered Agency Name"
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="New Password (min 6 characters)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#efc325] text-black font-bold text-sm cursor-pointer"
                >
                  {loading ? 'Updating...' : 'Reset Password & Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsResetMode(false); setError(''); }}
                  className="w-full text-xs text-neutral-400 hover:text-white py-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Agency or Studio Name"
                      value={form.agencyName}
                      onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                    />
                  </>
                )}
                <input
                  type="email"
                  required
                  placeholder="Work Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                />
                <div>
                  <div className="flex justify-end mb-1">
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => { setIsResetMode(true); setError(''); }}
                        className="text-xs font-semibold text-[#efc325] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password (min 6 characters)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#efc325] hover:bg-[#f5ce3e] text-black font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Open Executive Dashboard' : 'Create Free Workspace'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1e1e1e] py-5 text-center text-xs text-neutral-500">
        RankReady SaaS by{' '}
        <a href="https://zahidhussainofficial.com/" target="_blank" rel="noreferrer" className="text-[#efc325] hover:underline">
          Zahid Hussain
        </a>
      </footer>
    </div>
  );
}

function PublicReportPage() {
  const { shareId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/workspaces/public/${shareId}`)
      .then((res) => setReport(res.data.workspace || res.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 flex items-center justify-center">Loading Executive SEO Report...</div>;
  }
  if (!report) {
    return <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 flex items-center justify-center">Report link is invalid or expired.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#efc325]/35 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-5">
          <div>
            <RankReadyLogo />
            <h1 className="text-2xl font-extrabold text-white mt-3">
              Technical SEO Executive Report — {report.clientName}
            </h1>
            <p className="text-xs text-[#efc325] mt-1">{report.websiteUrl}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#efc325] text-black text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
        <SemiCircleAuditGauge score={report.seoScore || 96} />
        <div className="grid sm:grid-cols-2 gap-3 pt-4">
          {CHECKLIST_ITEMS.map((item) => {
            const ok = !!report.checklist?.[item.key];
            return (
              <div key={item.key} className="p-3.5 rounded-xl bg-[#0b0b0b] border border-[#222222] flex items-center gap-2.5 text-xs">
                <CheckCircle2 className={`w-4 h-4 ${ok ? 'text-emerald-400' : 'text-neutral-600'}`} />
                <span className={ok ? 'text-white' : 'text-neutral-400'}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rankready_user') || 'null');
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('rankready_token');
    localStorage.removeItem('rankready_user');
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthLandingPage onAuthSuccess={setUser} />} />
      <Route path="/dashboard" element={user ? <ExecutiveDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="/report/:shareId" element={<PublicReportPage />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}
