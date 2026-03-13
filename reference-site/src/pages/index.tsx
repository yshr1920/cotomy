import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import type {ReactElement} from 'react';

import styles from './index.module.css';

type SectionItem = {
  title: string;
  description: string;
};

const problems: string[] = [
  'Screens stay open for long periods',
  'Form state lives beyond a single request',
  'DOM stability matters for operational safety',
  'UI actions often represent business intent',
];

const approaches: string[] = [
  'Screen lifecycle coordination',
  'Form submission as a runtime protocol',
  'DOM-centered UI architecture',
  'Separation between UI intent and business logic',
];

const runtimeComponents: SectionItem[] = [
  {
    title: 'CotomyElement',
    description:
      'DOM-oriented UI wrapper that provides structural control over elements instead of component abstraction.',
  },
  {
    title: 'CotomyForm',
    description: 'A unified runtime abstraction for form submission and state handling.',
  },
  {
    title: 'CotomyApi',
    description:
      'A standardized API interaction layer that aligns UI actions with backend protocols.',
  },
  {
    title: 'CotomyPageController',
    description: 'Coordinates screen lifecycle, initialization, and UI behavior.',
  },
];

const useCases: string[] = [
  'line-of-business systems',
  'operational dashboards',
  'CRUD-heavy back-office tools',
  'long-lived administrative interfaces',
];

const cotomyElementExample = `CotomyElement.first("header")!.append(new CotomyElement({
  html: /* html */\`<div class="message" data-kind="info">Ready to build.</div>\`,
  css: /* css */\`
    [root] {
      display: grid;
      gap: 6px;
      padding: 8px 12px;
      background: #f6f7f8;
      border: 1px solid #d9dee3;
      border-radius: 6px;
    }
  \`
}));`;

function BulletList({items}: {items: string[]}): ReactElement {
  return (
    <ul className={styles.bulletList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function Home(): ReactElement {
  return (
    <Layout
      title="Cotomy"
      description="Cotomy is a DOM-first UI runtime for long-lived internal business screens."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>DOM-first UI runtime</p>
              <h1 className={styles.heroTitle}>Cotomy</h1>
              <p className={styles.heroSummary}>
                Cotomy is a DOM-first UI runtime for long-lived business screens.
              </p>
              <p className={styles.heroSubtitle}>
                A DOM-first UI runtime for internal business systems.
              </p>
              <p className={styles.heroDescription}>
                It keeps the DOM as the primary UI model for long-lived business
                screens.
              </p>
              <p className={styles.heroDescription}>
                It structures DOM behavior, form workflows, and screen lifecycle
                management.
              </p>
              <div className={styles.actions}>
                <Link className={styles.primaryAction} to="/reference/getting-started/">
                  Get Started
                </Link>
                <Link
                  className={styles.secondaryAction}
                  href="https://github.com/yshr1920/cotomy"
                >
                  GitHub
                </Link>
                <Link className={styles.tertiaryAction} href="https://blog.cotomy.net/">
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Problem</p>
              <h2>The Problem with Typical Web UI Architectures</h2>
            </div>
            <div className={styles.copyBlock}>
              <p>
                Typical web UI frameworks, especially SPA frameworks, tend to build
                the entire application as a single runtime.
              </p>
              <p>
                In internal business systems, however, work is usually organized
                around individual screens.
              </p>
              <p>
                Each screen has its own business context, and form handling, state
                retention, and user intent are managed at the screen level.
              </p>
              <p>
                When too much screen logic is concentrated within a single SPA runtime,
                state management, navigation logic, and UI responsibilities tend to
                become tightly coupled.
              </p>
              <BulletList items={problems} />
              <p>
                As the application grows, a single SPA runtime can accumulate
                navigation logic, UI state management, and workflow coordination in
                the same place.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Solution</p>
              <h2>Cotomy&apos;s Approach</h2>
            </div>
            <div className={styles.copyBlock}>
              <p>Cotomy treats the screen as a runtime surface.</p>
              <p>
                Instead of focusing on components, Cotomy organizes UI behavior around
                runtime boundaries and screen lifecycles.
              </p>
              <h3 className={styles.subheading}>Core ideas</h3>
              <BulletList items={approaches} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Components</p>
              <h2>Core Runtime Components</h2>
              <p className={styles.sectionLead}>
                Cotomy is composed of several runtime primitives.
              </p>
            </div>
            <div className={styles.cardGrid}>
              {runtimeComponents.map((component) => (
                <article key={component.title} className={styles.card}>
                  <h3>{component.title}</h3>
                  <p>{component.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Use Cases</p>
              <h2>Where Cotomy Fits</h2>
            </div>
            <div className={styles.copyBlock}>
              <p>
                Cotomy is designed for internal business applications, especially
                systems that remain open for long sessions, such as
              </p>
              <BulletList items={useCases} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Example</p>
              <h2>CotomyElement Example</h2>
            </div>
            <div className={styles.copyBlock}>
              <p>
                The following example illustrates how Cotomy structures UI behavior
                around DOM boundaries.
              </p>
              <p>
                CotomyElement represents a stable DOM boundary that encapsulates
                interaction logic and styling.
              </p>
            </div>
            <div className={styles.exampleBlock}>
              <CodeBlock language="ts">{cotomyElementExample}</CodeBlock>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionLabel}>Resources</p>
              <h2>Learn More</h2>
            </div>
            <div className={styles.resourceGrid}>
              <Link className={styles.resourceCard} to="/reference/getting-started/">
                <span className={styles.resourceTitle}>Getting Started guide</span>
                <span className={styles.resourceMeta}>cotomy.net/reference/getting-started/</span>
              </Link>
              <Link className={styles.resourceCard} to="/reference/">
                <span className={styles.resourceTitle}>Reference Documentation</span>
                <span className={styles.resourceMeta}>cotomy.net/reference/</span>
              </Link>
              <Link
                className={styles.resourceCard}
                href="https://github.com/yshr1920/cotomy"
              >
                <span className={styles.resourceTitle}>GitHub Repository</span>
                <span className={styles.resourceMeta}>github.com/yshr1920/cotomy</span>
              </Link>
              <Link className={styles.resourceCard} href="https://blog.cotomy.net/series/design/">
                <span className={styles.resourceTitle}>Design Philosophy Articles</span>
                <span className={styles.resourceMeta}>blog.cotomy.net/series/design/</span>
              </Link>
              <Link className={styles.resourceCard} href="https://blog.cotomy.net/series/usage/">
                <span className={styles.resourceTitle}>Technical Articles</span>
                <span className={styles.resourceMeta}>blog.cotomy.net/series/usage/</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
