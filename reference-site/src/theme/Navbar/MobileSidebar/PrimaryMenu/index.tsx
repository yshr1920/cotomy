import NavbarItem from '@theme/NavbarItem';
import IconExternalLink from '@theme/Icon/ExternalLink';
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
                <IconExternalLink />
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
