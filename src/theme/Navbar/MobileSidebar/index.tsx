/**
 * Swizzle of @docusaurus/theme-classic/lib/theme/Navbar/MobileSidebar.
 *
 * Why we need this:
 * Docusaurus's mobile-sidebar context gates `shouldRender` on
 * `useWindowSize() === 'mobile'`, where the breakpoint is hardcoded
 * at 996 in `@docusaurus/theme-common/hooks/useWindowSize`. At
 * 997-1280px our navbar still has too many items to fit in one row,
 * so we force the hamburger drawer via CSS (custom.css) — but the
 * drawer JSX returns `null` on the JS-side "desktop" range, leaving
 * the toggle dead.
 *
 * Fix: render the drawer based on our own breakpoint (1280) instead
 * of the Docusaurus-default `shouldRender`. The toggle still goes
 * through the original `useNavbarMobileSidebar` context, so its
 * `shown` state stays in sync with the rest of the navbar layout.
 *
 * The drawer's CSS in Infima isn't media-query gated for visibility
 * (it slides in via `.navbar-sidebar--show` class), so a wider
 * breakpoint here is safe.
 */
import React, {type ReactNode} from 'react';
import {useWindowSize} from '@docusaurus/theme-common';
import {
  useLockBodyScroll,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

const NAVBAR_DRAWER_BREAKPOINT = 1280;

export default function NavbarMobileSidebar(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const windowSize = useWindowSize({
    desktopBreakpoint: NAVBAR_DRAWER_BREAKPOINT,
  });
  useLockBodyScroll(mobileSidebar.shown);

  if (mobileSidebar.disabled) {
    return null;
  }

  if (windowSize === 'ssr' || windowSize === 'desktop') {
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
