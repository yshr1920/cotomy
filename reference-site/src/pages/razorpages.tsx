import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import type { ReactElement } from 'react';

import styles from './razorpages.module.css';

type PlanFeature = string;

type Plan = {
  id: string;
  badge: string;
  name: string;
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
    ],
    featured: true,
  },
];

type CompareRow = {
  feature: string;
  standard: boolean | string;
  professional: boolean | string;
};

const compareRows: CompareRow[] = [
  {feature: 'UI Framework (Form / Dialog / SidePanel)', standard: true, professional: true},
  {feature: 'TypeScript / webpack integration', standard: true, professional: true},
  {feature: 'Authentication hook (IAuthorityUserProvider)', standard: true, professional: true},
  {feature: 'Cookie authentication (fully implemented)', standard: false, professional: true},
  {feature: 'Login UI / user management screen', standard: false, professional: true},
  {feature: 'CRUD templates (Product / Order / User)', standard: false, professional: true},
  {feature: 'EF Core + SQL Server integration', standard: false, professional: true},
  {feature: 'Role-based authorization + Permission Checker', standard: false, professional: true},
];

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
      title="Razor Pages Templates"
      description="Cotomy Razor Pages Templates — project templates available in Standard and Professional plans."
    >
      <main className={styles.page}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>Project Templates</p>
              <h1 className={styles.heroTitle}>Cotomy Razor Pages</h1>
              <p className={styles.heroSubtitle}>
                Skip the authentication, CRUD, and project setup you repeat every time — start writing business logic on day one.
              </p>
              <p className={styles.heroDescription}>
                Standard provides a lightweight foundation with a UI framework and authentication hook.
                Professional adds Cookie authentication, CRUD templates, and EF Core for a production-ready architecture.
                Both plans are built on <Link to="/reference/getting-started/">Cotomy OSS</Link> as the core.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#plans">
                  See the templates ↓
                </a>
                <Link className={styles.secondaryAction} to="/reference/getting-started/">
                  Cotomy Getting Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className={styles.sectionAlt} id="plans">
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Plans</p>
              <h2>Choose a Plan</h2>
              <p className={styles.sectionLead}>
                Standard is suited for rapid prototyping or adding UI to an existing backend.
                Choose Professional when you need authentication, a data model, and CRUD all in place from the start.
              </p>
            </div>
            <div className={styles.planGrid}>
              {plans.map((plan) => (
                <div key={plan.id} className={`${styles.planCard}${plan.featured ? ` ${styles.featured}` : ''}`}>
                  <div>
                    <span className={styles.planBadge}>{plan.badge}</span>
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
                      {plan.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.planCta}>
                    <a
                      className={styles.primaryAction}
                      href="#"
                      aria-label={`Buy ${plan.name}`}
                    >
                      Buy now and start building ([link])
                    </a>
                    <p className={styles.planCtaNote}>Secure checkout via Gumroad</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className={styles.section}>
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
                    <td>{row.feature}</td>
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

        {/* About / Requirements */}
        <section className={styles.sectionAlt}>
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
                The Professional plan requires SQL Server or a local Docker environment.
                A <code>docker-compose.sqlserver.yml</code> is included, so Docker is all you need.
              </p>
            </div>
          </div>
        </section>

        {/* Get Started guidance */}
        <section className={styles.section}>
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
                  <strong>Choose a plan and purchase</strong> — use the buy button above to purchase via Gumroad ([link]).
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

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className="container">
            <h2>Cotomy Razor Pages Templates</h2>
            <p>Skip the boilerplate. Start with the right structure on day one.</p>
            <div className={styles.ctaBannerActions}>
              <a className={styles.ctaBannerPrimary} href="#">
                Buy Standard ([link])
              </a>
              <a className={styles.ctaBannerSecondary} href="#">
                Buy Professional ([link])
              </a>
            </div>
          </div>
        </div>

      </main>
    </Layout>
  );
}
