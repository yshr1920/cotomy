import Link from '@docusaurus/Link';
import IconExternalLink from '@theme/Icon/ExternalLink';
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
                    {item.href && <IconExternalLink />}
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
