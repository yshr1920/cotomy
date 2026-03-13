import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import clsx from 'clsx';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';

import styles from './styles.module.css';

type NavbarItemConfig = {
  label?: string;
  href?: string;
  to?: string;
  position?: 'left' | 'right';
};

function useRightNavbarItems(): NavbarItemConfig[] {
  return (useThemeConfig().navbar.items as NavbarItemConfig[]).filter(
    (item) => item.position === 'right',
  );
}

function ExternalLinkIcon(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={styles.externalIcon}
    >
      <path
        fill="currentColor"
        d="M14 5h5v5h-2V8.41l-6.29 6.3-1.42-1.42 6.3-6.29H14V5Zm3 14H7V7h5V5H7C5.9 5 5 5.9 5 7v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-5h-2v5Z"
      />
    </svg>
  );
}

export default function DocSidebarDesktop({
  path,
  sidebar,
  onCollapse,
  isHidden,
}: {
  path: string;
  sidebar: unknown;
  onCollapse: () => void;
  isHidden: boolean;
}): React.JSX.Element {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();
  const rightItems = useRightNavbarItems();

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}
    >
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      {rightItems.length > 0 && (
        <nav className={styles.sidebarLinks} aria-label="Supplementary links">
          <ul className="menu__list">
            {rightItems.map((item) => {
              if (!item.label) {
                return null;
              }

              const key = `${item.label}-${item.href ?? item.to ?? ''}`;

              return (
                <li key={key} className="menu__list-item">
                  <Link
                    className={clsx('menu__link', styles.sidebarLink)}
                    href={item.href}
                    to={item.to}
                  >
                    <span>{item.label}</span>
                    {item.href && <ExternalLinkIcon />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
