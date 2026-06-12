import React from 'react';
import styles from './styles.module.css';

/**
 * Four mockup screens of the TLSN mobile app, rendered as styled HTML —
 * no screenshot assets, no light/dark variants to maintain. Colors and copy
 * mirror the real React Native screens at:
 *
 *   app/mobile/app/(tabs)/index.tsx                    → <GalleryMockup />
 *   app/mobile/components/tlsn/PluginApprovalSheet.tsx → <PluginApprovalMockup />
 *   app/mobile/components/tlsn/RevealApprovalSheet.tsx → <RevealApprovalMockup />
 *   app/mobile/app/plugin/[id].tsx (success branch)    → <SuccessMockup />
 */

export default function MobileAppShowcase() {
  return (
    <div className={styles.showcase}>
      <Phone caption="1. Browse plugins">
        <GalleryMockup />
      </Phone>
      <Phone caption="2. Approve the plugin">
        <PluginApprovalMockup />
      </Phone>
      <Phone caption="3. Approve the reveal">
        <RevealApprovalMockup />
      </Phone>
      <Phone caption="4. See the verified result">
        <SuccessMockup />
      </Phone>
    </div>
  );
}

interface PhoneProps {
  caption: string;
  children: React.ReactNode;
}

function Phone({ caption, children }: PhoneProps) {
  return (
    <figure className={styles.phoneWrap}>
      <div className={styles.phone}>
        <div className={styles.notch} aria-hidden="true" />
        <div className={styles.statusBar} aria-hidden="true">
          <span className={styles.statusTime}>9:41</span>
          <span className={styles.statusRight}>
            <span className={styles.signal} />
            <span className={styles.signal} />
            <span className={styles.signal} />
            <span className={styles.battery} />
          </span>
        </div>
        <div className={styles.screen}>{children}</div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared chrome — navbar + tab bar                                            */
/* -------------------------------------------------------------------------- */

function Navbar({ title, hideBack }: { title: string; hideBack?: boolean }) {
  return (
    <div className={styles.navbar}>
      {!hideBack && <span className={styles.navbarBack}>‹</span>}
      <span className={styles.navbarTitle}>{title}</span>
      <span className={styles.navbarSpacer} />
    </div>
  );
}

function TabBar({ active }: { active: 'plugins' | 'about' | 'settings' }) {
  return (
    <div className={styles.tabBar}>
      <TabBarItem icon="☰" label="Plugins" isActive={active === 'plugins'} />
      <TabBarItem icon="ⓘ" label="About" isActive={active === 'about'} />
      <TabBarItem icon="⚙" label="Settings" isActive={active === 'settings'} />
    </div>
  );
}

function TabBarItem({ icon, label, isActive }: { icon: string; label: string; isActive: boolean }) {
  return (
    <div className={`${styles.tabBarItem} ${isActive ? styles.tabBarItemActive : ''}`}>
      <span className={styles.tabBarIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.tabBarLabel}>{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen 1 — plugin gallery                                                  */
/* -------------------------------------------------------------------------- */

const GALLERY_PLUGINS: Array<{ logo: string; name: string; description: string; wip?: boolean }> = [
  { logo: '🐦', name: 'Twitter', description: 'Prove your handle and follower count.' },
  { logo: '🎵', name: 'Spotify', description: 'Prove your top artist of the year.' },
  { logo: '🦉', name: 'Duolingo', description: 'Prove your current streak.' },
  { logo: '🏦', name: 'Swiss Bank', description: 'Prove your balance is over a threshold.' },
];

function GalleryMockup() {
  return (
    <div className={styles.screenColumn}>
      <Navbar title="TLSNotary" hideBack />
      <div className={styles.gallery}>
        {GALLERY_PLUGINS.map((p) => (
          <div key={p.name} className={styles.galleryCard}>
            <span className={styles.galleryLogo}>{p.logo}</span>
            <div className={styles.galleryBody}>
              <div className={styles.galleryNameRow}>
                <span className={styles.galleryName}>{p.name}</span>
                {p.wip && <span className={styles.wipBadge}>WIP</span>}
              </div>
              <span className={styles.galleryDescription}>{p.description}</span>
            </div>
          </div>
        ))}
      </div>
      <TabBar active="plugins" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen 2 — pre-execution plugin approval                                   */
/* -------------------------------------------------------------------------- */

function PluginApprovalMockup() {
  return (
    <div className={styles.screenColumn}>
      <Navbar title="Spotify" />
      <div className={styles.dimmedContent} aria-hidden="true">
        <div className={styles.dimmedShape} />
        <div className={styles.dimmedShape} />
        <div className={styles.dimmedShape} />
      </div>
      <div className={styles.sheetBackdrop} />
      <div className={styles.sheetCard}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetTitle}>Spotify</div>
        <div className={styles.sheetByline}>TLSNotary · v1.0.0</div>
        <div className={styles.sheetBody}>
          Prove your top Spotify artist of the year without revealing your account.
        </div>
        <div className={styles.sectionLabel}>WILL REQUEST DATA FROM</div>
        <div className={styles.requestRow}>
          <span className={styles.methodBadge}>GET</span>
          <span className={styles.requestHost}>
            api.spotify.com<span className={styles.requestPath}>/v1/me/top/artists</span>
          </span>
        </div>
        <div className={styles.requestRow}>
          <span className={styles.methodBadge}>GET</span>
          <span className={styles.requestHost}>
            api.spotify.com<span className={styles.requestPath}>/v1/me</span>
          </span>
        </div>
        <div className={styles.sourceLink}>View source on GitHub ↗</div>
        <div className={styles.sheetActions}>
          <button type="button" className={`${styles.sheetButton} ${styles.btnReject}`}>
            Reject
          </button>
          <button type="button" className={`${styles.sheetButton} ${styles.btnManual}`}>
            Approve each reveal
          </button>
          <button type="button" className={`${styles.sheetButton} ${styles.btnAllSession}`}>
            Approve all reveals
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen 3 — reveal approval                                                  */
/* -------------------------------------------------------------------------- */

function RevealApprovalMockup() {
  return (
    <div className={styles.screenColumn}>
      <Navbar title="Spotify" />
      <div className={styles.dimmedContent} aria-hidden="true">
        <div className={styles.dimmedShape} />
        <div className={styles.dimmedShape} />
      </div>
      <div className={styles.sheetBackdrop} />
      <div className={styles.sheetCard}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetTitle}>Approve reveal to verifier</div>
        <div className={styles.sheetSubtitle}>
          Review the bytes that will be sent to the verifier.
        </div>
        <RevealRow label="Request URL" badge="REVEAL" badgeKind="reveal">
          GET /v1/me/top/artists?limit=1
        </RevealRow>
        <RevealRow label="Authorization" badge="HASH · SHA-256" badgeKind="hash" hashed>
          Bearer ••••••••••••••••
        </RevealRow>
        <RevealRow label="Top artist (response)" badge="REVEAL" badgeKind="reveal">
          "items":[{'{'}"name":"Charli xcx"
        </RevealRow>
        <div className={styles.sheetActions}>
          <button type="button" className={`${styles.sheetButton} ${styles.btnReject}`}>
            Reject
          </button>
          <button type="button" className={`${styles.sheetButton} ${styles.btnAllSession}`}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

interface RevealRowProps {
  label: string;
  badge: string;
  badgeKind: 'reveal' | 'hash';
  hashed?: boolean;
  children: React.ReactNode;
}

function RevealRow({ label, badge, badgeKind, hashed, children }: RevealRowProps) {
  return (
    <div className={styles.revealRow}>
      <div className={styles.revealRowHeader}>
        <span className={styles.revealRowLabel}>{label}</span>
        <span
          className={`${styles.revealBadge} ${badgeKind === 'reveal' ? styles.badgeReveal : styles.badgeHash}`}
        >
          {badge}
        </span>
      </div>
      <div className={`${styles.revealPreview} ${hashed ? styles.revealHashed : ''}`}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen 4 — success                                                          */
/* -------------------------------------------------------------------------- */

function SuccessMockup() {
  // Spotify accent (#1db954) for both banner and key label, per the registry.
  const accent = '#1db954';
  return (
    <div className={styles.screenColumn}>
      <Navbar title="Spotify" />
      <div className={styles.successScrollArea}>
        <div className={styles.successBanner} style={{ backgroundColor: accent }}>
          <span className={styles.successLogo}>🎵</span>
          <div className={styles.successBannerText}>
            <span className={styles.successPluginName}>Spotify</span>
            <span className={styles.successVerifiedBadge}>Verified</span>
          </div>
        </div>
        <div className={styles.successKeyCard}>
          <div className={styles.successKeyLabel} style={{ color: accent }}>
            TOP ARTIST
          </div>
          <div className={styles.successKeyValue}>Charli xcx</div>
        </div>
        <div className={styles.successDetailCard}>
          <div className={styles.successDetailTitle}>VERIFIED DETAILS</div>
          <div className={styles.successDetailRow}>api.spotify.com</div>
          <div className={styles.successDetailRow}>Just now</div>
        </div>
        <div className={styles.successToggle}>▶  Show Proven Data</div>
        <div className={styles.successToggle}>▶  Show Raw Data</div>
        <button
          type="button"
          className={styles.successBackBtn}
          style={{ backgroundColor: accent }}
        >
          Back to Plugins
        </button>
      </div>
    </div>
  );
}
