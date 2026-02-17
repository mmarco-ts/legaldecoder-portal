import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Scale, FileText, ShieldCheck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-new">
      <header className="home-header">
        <h1 className="home-header-title">Legal Decoder Portal</h1>
        <div className="home-header-actions">
          <div className="header-icon-placeholder"></div>
          <div className="header-icon-placeholder"></div>
          <div className="header-icon-placeholder"></div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Legal Spend<br />Intelligence
          </h1>
          <p className="home-hero-subtitle">
            Turn complex legal invoices into clear stories to see what really happened, whether it was efficient, and what it should have cost
          </p>
        </div>
      </section>

      <section className="home-stats-section">
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <Scale size={28} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">48</span>
            <span className="home-stat-label">Compliance Flags</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <FileText size={28} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">200K+</span>
            <span className="home-stat-label">Invoice Lines Analyzed</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <ShieldCheck size={28} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">3</span>
            <span className="home-stat-label">Flag Categories</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">Get Started</h2>
        <div className="home-cards-row">
          <button className="home-card" onClick={() => navigate('/dashboard')}>
            <div className="home-card-icon">
              <LayoutDashboard size={24} color="white" />
            </div>
            <div className="home-card-content">
              <h3>Compliance Dashboard</h3>
              <p>Review invoice compliance flags, potential write-downs, and billing efficiency metrics</p>
            </div>
          </button>
          <button className="home-card" onClick={() => navigate('/ai-analytics')}>
            <div className="home-card-icon">
              <Sparkles size={24} color="white" />
            </div>
            <div className="home-card-content">
              <h3>AI Analytics</h3>
              <p>Ask questions in natural language about invoices, flags, and billing patterns</p>
            </div>
          </button>
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">Capabilities</h2>
        <div className="home-cards-row-three">
          <div className="home-card-small">
            <div className="home-card-icon">
              <ShieldCheck size={24} color="white" />
            </div>
            <div className="home-card-content">
              <h3>Compliance Flagging</h3>
              <p>48 automated flags across Billing Hygiene, Workflow, and Staffing Efficiencies to catch overbilling and inefficiencies.</p>
            </div>
          </div>
          <div className="home-card-small">
            <div className="home-card-icon">
              <Sparkles size={24} color="white" />
            </div>
            <div className="home-card-content">
              <h3>AI-Powered Insights</h3>
              <p>Ask questions like "What are the top flagged invoices by amount?" or "Show me billing by law firm" and get instant answers.</p>
            </div>
          </div>
          <div className="home-card-small">
            <div className="home-card-icon">
              <Scale size={24} color="white" />
            </div>
            <div className="home-card-content">
              <h3>Write-Down Analysis</h3>
              <p>Identify potential write-downs across invoices and track savings opportunities by firm, timekeeper, and matter.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
