import Link from '@docusaurus/Link';
import IconExternalLink from '@theme/Icon/ExternalLink';
import Layout from '@theme/Layout';
import type { ReactElement } from 'react';

import styles from './razorpages.module.css';

type PlanFeature = string;

type Plan = {
  id: string;
  badge: string;
  name: string;
  tagline: string;
  priceLaunch: string;
  priceRegular: string;
  description: string;
  features: PlanFeature[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    id: 'standard',
    badge: 'Standard',
    name: 'Cotomy Standard',
    tagline: 'UI only — bring your own backend',
    priceLaunch: '$39',
    priceRegular: '$49 regular',
    description:
      'UI Framework + Page Architecture + Authentication Hook. Ideal for projects that add UI to an existing backend, or when you want to design your own authentication and data layer.',
    features: [
      'CotomyPageController — screen lifecycle management',
      'Form / Renderer — two-way binding form infrastructure',
      'Dialog / ModalDialog / SidePanel components',
      'ProcessingArea — async operation display',
      'webpack per-page entry point integration',
      'ITokenService / IAuthorityUserProvider authentication hook',
      'DemoAuthProvider (development skeleton)',
      'Bootstrap-based UI styles',
      '_Layout.cshtml / _ViewStart.cshtml',
      'Form, Dialog, and SidePanel demo pages',
    ],
  },
  {
    id: 'professional',
    badge: 'Professional',
    name: 'Cotomy Professional',
    tagline: 'Full business app starter',
    priceLaunch: '$89',
    priceRegular: '$99 regular',
    description:
      'Everything in Standard, plus Cookie authentication, CRUD templates, and EF Core integration — a production-ready architecture. Start with login, CRUD, and a working database from day one.',
    features: [
      'Everything in Standard',
      'Cookie authentication (HttpOnly / Secure / SameSite / Sliding Expiration)',
      'Login and logout flow',
      'Role-based authorization + IPermissionChecker',
      'IPasswordHasher (Pbkdf2) password hashing',
      'CSRF protection by design',
      'Product CRUD — list, detail, edit, delete',
      'Order CRUD — composite entity (master / detail)',
      'User CRUD — admin screen reference',
      'EF Core + SQL Server code-first',
      'DTO contract pattern (Request / Response)',
      'Validation pipeline (unified ApiMessage error format)',
      'Persistence architecture (Repository / Transaction / RowVersion)',
    ],
    featured: true,
  },
];

type CompareRow = {
  feature: string;
  description: string;
  standard: boolean | string;
  professional: boolean | string;
};

const compareRows: CompareRow[] = [
  {feature: 'UI Framework (Form / Dialog / SidePanel)', description: 'Two-way binding forms, modal dialogs, side panels, and async display areas', standard: true, professional: true},
  {feature: 'TypeScript / webpack integration', description: 'Per-page entry point bundling with full TypeScript compilation', standard: true, professional: true},
  {feature: 'Authentication hook (IAuthorityUserProvider)', description: 'Interface + DemoAuthProvider skeleton — plug in your own implementation', standard: true, professional: true},
  {feature: 'Cookie authentication (fully implemented)', description: 'HttpOnly / Secure / SameSite / Sliding Expiration, fully wired', standard: false, professional: true},
  {feature: 'Login UI / user management screen', description: 'Login / logout pages and User CRUD admin screen', standard: false, professional: true},
  {feature: 'CRUD templates (Product / Order / User)', description: 'List, detail, edit, and delete pages with pagination and filtering', standard: false, professional: true},
  {feature: 'EF Core + SQL Server integration', description: 'Code-first DbContext, entity base class, and migrations', standard: false, professional: true},
  {feature: 'Role-based authorization + Permission Checker', description: 'IPermissionChecker contract with role-based access control', standard: false, professional: true},
  {feature: 'DTO contract pattern (Request / Response)', description: 'Separate Request / Response DTOs decoupled from Entity classes', standard: false, professional: true},
  {feature: 'Validation pipeline (unified error format)', description: 'DataAnnotations + ApiMessage unified error response format', standard: false, professional: true},
  {feature: 'Persistence architecture (Repository / Transaction / RowVersion)', description: 'Repository pattern, transaction boundaries, and optimistic concurrency', standard: false, professional: true},
];

const storeUrl = 'https://store.cotomy.net';

function CheckOrDash({value}: {value: boolean | string}): ReactElement {
  if (value === true) {
    return <span className={styles.checkmark}>✓</span>;
  }
  if (value === false) {
    return <span className={styles.dash}>—</span>;
  }
  return <span>{value}</span>;
}

export default function RazorPages(): ReactElement {
  return (
    <Layout
      title="Razor Pages Project Template"
      description="Cotomy Razor Pages Project Template — available in Standard and Professional editions."
    >
      <main className={styles.page}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>Project Templates</p>
              <h1 className={styles.heroTitle}>Cotomy Razor Pages Project Template</h1>
              <p className={styles.heroSubtitle}>
                Stop rebuilding authentication, CRUD, and project structure for every business app — start with the foundation already in place.
              </p>
              <p className={styles.heroDescription}>
                Standard provides a lightweight foundation with a UI framework and authentication hook.
                Professional adds Cookie authentication, CRUD templates, and EF Core for a production-ready architecture.
                Both editions are built on <Link to="/reference/getting-started/">Cotomy OSS</Link> as the core.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#editions">
                  Compare editions ↓
                </a>
                <a className={styles.secondaryAction} href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <span className={styles.externalLabel}>
                    <span>Open Cotomy Store</span>
                    <IconExternalLink />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Razor Pages */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Design Philosophy</p>
              <h2>Built for apps that don&apos;t need a SPA</h2>
              <p className={styles.sectionLead}>
                Not every business system needs a full front-end framework.
                Internal tools, CRUD-heavy workflows, and admin screens are a natural fit for server-rendered pages.
                Cotomy is designed for this — a Razor Pages foundation with structured TypeScript,
                per-screen architecture, and predictable patterns that stay maintainable as the project grows.
              </p>
            </div>
          </div>
        </section>

        {/* Editions */}
        <section className={styles.sectionAlt} id="editions">
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Editions</p>
              <h2>Which Edition Fits Your Project?</h2>
              <p className={styles.sectionLead}>
                Most projects should choose Professional — it includes everything needed to ship a working business app from day one.
                Standard is for custom backend cases.
              </p>
            </div>
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <div key={plan.id} className={`${styles.planCard}${plan.featured ? ` ${styles.featured}` : ''}`}>
                  <div className={styles.planBadgeRow}>
                    <span className={styles.planBadge}>{plan.badge}</span>
                    {plan.featured && <span className={styles.recommendedBadge}>Recommended</span>}
                    <p className={styles.planTagline}>{plan.tagline}</p>
                  </div>
                  <div className={styles.planHeader}>
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <div className={styles.planPrice}>
                      <span className={styles.planPriceLaunch}>{plan.priceLaunch}</span>
                      <span className={styles.planPriceRegular}>launch — {plan.priceRegular}</span>
                    </div>
                  </div>
                  <p className={styles.planDescription}>{plan.description}</p>
                  <div>
                    <p className={styles.planFeatureLabel}>What&apos;s included</p>
                    <ul className={styles.planFeatureList}>
                      {plan.features.slice(0, 4).map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {plan.features.length > 4 && (
                      <p className={styles.planFeatureMore}>
                        <a href="#comparison">See detailed comparison ↓</a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.storeCta}>
              <p className={styles.storeCtaNote}>
                Edition selection happens on the store page.
              </p>
              <a className={styles.primaryAction} href={storeUrl} target="_blank" rel="noopener noreferrer">
                <span className={styles.externalLabel}>
                  <span>Go to store and choose your edition</span>
                  <IconExternalLink />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className={`${styles.section} ${styles.compareSection}`} id="comparison">
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Comparison</p>
              <h2>Feature Comparison</h2>
            </div>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Standard</th>
                  <th>Professional</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.feature}>
                    <td>
                      <span className={styles.compareFeatureName}>{row.feature}</span>
                      <span className={styles.compareFeatureDesc}>{row.description}</span>
                    </td>
                    <td>
                      <CheckOrDash value={row.standard} />
                    </td>
                    <td>
                      <CheckOrDash value={row.professional} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Get Started guidance */}
        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Get Started</p>
              <h2>From Purchase to Running</h2>
              <p className={styles.sectionLead}>
                The setup is designed so you can start building immediately after purchase.
              </p>
            </div>
            <div className={styles.infoBlock}>
              <ol>
                <li>
                  <strong>Choose an edition and purchase</strong> — open Cotomy Store and choose your edition.
                </li>
                <li>
                  <strong>Extract the archive</strong> — unzip the downloaded template and open the folder in VS Code.
                </li>
                <li>
                  <strong>Install dependencies</strong> — run{' '}
                  <code>npm install</code> and <code>dotnet restore</code> in the terminal.
                </li>
                <li>
                  <strong>Start the dev server</strong> — run <code>dotnet run</code> to launch the app.
                  Full setup instructions are in the <code>README.md</code> bundled with the template.
                </li>
              </ol>
              <p>
                For Cotomy OSS usage, see the{' '}
                <Link to="/reference/getting-started/">Getting Started guide</Link>
                {' '}and the{' '}
                <Link to="/reference/">Reference documentation</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* About / Requirements */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Requirements</p>
              <h2>Requirements</h2>
            </div>
            <div className={styles.infoBlock}>
              <p>
                The templates require the following environment.
              </p>
              <ul>
                <li>OS: Windows 11 or later / macOS (Apple Silicon or Intel)</li>
                <li>.NET SDK 10</li>
                <li>Node.js 20 or later (includes npm)</li>
                <li>Git</li>
                <li>VS Code (recommended)</li>
              </ul>
              <p>
                The Professional edition requires Docker for SQL Server — a <code>docker-compose.sqlserver.yml</code> is included.
                The <code>dotnet ef</code> CLI tool is also required for database migrations (<code>dotnet tool install --global dotnet-ef</code>).
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className="container">
            <h2>Cotomy Razor Pages Project Template</h2>
            <p>Skip the boilerplate. Start with the right structure on day one.</p>
            <div className={styles.ctaBannerActions}>
              <a className={styles.ctaBannerPrimary} href={storeUrl} target="_blank" rel="noopener noreferrer">
                <span className={styles.externalLabel}>
                  <span>Open Cotomy Store</span>
                  <IconExternalLink />
                </span>
              </a>
              <a className={styles.ctaBannerSecondary} href="#editions">
                Compare editions
              </a>
            </div>
          </div>
        </div>

      </main>
    </Layout>
  );
}
