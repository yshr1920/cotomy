import NavbarItem from '@theme/NavbarItem';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

type NavbarItemConfig = {
  position?: 'left' | 'right';
  type?: string;
  [key: string]: unknown;
};

function useNavbarItems(): NavbarItemConfig[] {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function ExternalLinkIcon(): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.externalIcon}>
      <path
        fill="currentColor"
        d="M14 5h5v5h-2V8.41l-6.29 6.3-1.42-1.42 6.3-6.29H14V5Zm3 14H7V7h5V5H7C5.9 5 5 5.9 5 7v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-5h-2v5Z"
      />
    </svg>
  );
}

export default function NavbarMobilePrimaryMenu(): React.JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const leftItems = items.filter((item) => item.position !== 'right');
  const rightItems = items
    .filter((item) => item.position === 'right')
    .map((item) =>
      item.href
        ? {
            ...item,
            label: (
              <span className={styles.externalLabel}>
                <span>{String(item.label ?? '')}</span>
                <ExternalLinkIcon />
              </span>
            ),
          }
        : item,
    );

  return (
    <>
      <ul className="menu__list">
        {leftItems.map((item, index) => (
          <NavbarItem
            mobile
            {...item}
            onClick={() => mobileSidebar.toggle()}
            key={`left-${index}`}
          />
        ))}
      </ul>
      {rightItems.length > 0 && (
        <ul className="menu__list navbar-sidebar__group">
          {rightItems.map((item, index) => (
            <NavbarItem
              mobile
              {...item}
              onClick={() => mobileSidebar.toggle()}
              key={`right-${index}`}
            />
          ))}
        </ul>
      )}
    </>
  );
}
