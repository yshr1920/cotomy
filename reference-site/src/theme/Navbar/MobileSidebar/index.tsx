import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';
import {useLockBodyScroll, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {useEffect, useState} from 'react';

const desktopSidebarBreakpoint = 1540;

function useShouldRenderDesktopSidebar(): boolean {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const updateShouldRender = (): void => {
      setShouldRender(window.innerWidth <= desktopSidebarBreakpoint);
    };

    updateShouldRender();
    window.addEventListener('resize', updateShouldRender);

    return () => {
      window.removeEventListener('resize', updateShouldRender);
    };
  }, []);

  return shouldRender;
}

export default function NavbarMobileSidebar(): React.JSX.Element | null {
  const mobileSidebar = useNavbarMobileSidebar();
  const shouldRenderDesktopSidebar = useShouldRenderDesktopSidebar();

  useLockBodyScroll(mobileSidebar.shown);

  if (mobileSidebar.disabled) {
    return null;
  }

  if (!mobileSidebar.shouldRender && !shouldRenderDesktopSidebar) {
    return null;
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}
