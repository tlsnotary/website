import React from 'react';
import styles from './styles.module.css';

/**
 * Four mockup screens of the TLSN mobile app, rendered as styled HTML —
 * no screenshot assets, no light/dark variants to maintain, no app/store
 * frames to chase. Colors and copy mirror the real React Native screens at:
 *
 *   app/mobile/app/(tabs)/index.tsx           → <GalleryMockup />
 *   app/mobile/components/tlsn/PluginApprovalSheet.tsx → <PluginApprovalMockup />
 *   app/mobile/components/tlsn/RevealApprovalSheet.tsx → <RevealApprovalMockup />
 *   app/mobile/app/plugin/[id].tsx (success branch)     → <SuccessMockup />
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
          <span>9:41</span>
          <span className={styles.statusIcons}>
            <span aria-hidden>●●●</span>
            <span aria-hidden>📶</span>
            <span aria-hidden>▮</span>
          </span>
        </div>
        <div className={styles.screen}>{children}</div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen 1 — plugin gallery                                                  */
/* -------------------------------------------------------------------------- */

const GALLERY_PLUGINS: Array<{ logo: string; name: string; description: string; wip?: boolean }> = [
  { logo: '🐦', name: 'Twitter', description: 'Prove your handle and follower count.' },
  { logo: '🎵', name: 'Spotify', description: 'Prove your top artist of the year.' },
  { logo: '🦉', name: 'Duolingo', description: 'Prove your current streak.' },
  { logo: '🏦', name: 'Swiss Bank', description: 'Prove your balance is above a threshold.' },
  { logo: '🚗', name: 'Uber', description: 'Prove your lifetime trip count.', wip: true },
];

function GalleryMockup() {
  return (
    <div className={styles.gallery}>
      <div className={styles.galleryHeader}>
        <span>Plugins</span>
      </div>
      <div className={styles.galleryList}>
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
    <div className={styles.sheetScreen}>
      <div className={styles.sheetBackdrop} />
      <div className={styles.sheetCard}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetTitle}>Spotify</div>
        <div className={styles.sheetByline}>by TLSNotary · v1.0.0</div>
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
        <div className={styles.sourceLink}>View source on GitHub →</div>
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
    <div className={styles.sheetScreen}>
      <div className={styles.sheetBackdrop} />
      <div className={styles.sheetCard}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetTitle}>Approve reveal to verifier</div>
        <div className={styles.sheetSubtitle}>
          Review the bytes that will be sent to the verifier.
        </div>
        <div className={styles.revealList}>
          <RevealRow label="Request URL" badge="REVEAL" badgeKind="reveal">
            GET /v1/me/top/artists?limit=1&time_range=long_term HTTP/1.1
          </RevealRow>
          <RevealRow label="Authorization header" badge="HASH · SHA-256" badgeKind="hash" hashed>
            Bearer ••••••••••••••••••••••••••
          </RevealRow>
          <RevealRow label="Response: top artist name" badge="REVEAL" badgeKind="reveal">
            "items":[{'{'}"name":"Charli xcx"
          </RevealRow>
        </div>
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
  return (
    <div className={styles.successScreen}>
      <div className={styles.successBanner}>
        <span className={styles.successLogo}>🎵</span>
        <span className={styles.successPluginName}>Spotify</span>
        <span className={styles.successVerifiedBadge}>VERIFIED</span>
      </div>
      <div className={styles.successResultCard}>
        <div className={styles.successResultLabel}>Top Artist</div>
        <div className={styles.successResultValue}>Charli xcx</div>
      </div>
      <div className={styles.successDetailCard}>
        <div className={styles.successDetailRow}>
          <span className={styles.successDetailKey}>Verified on</span>
          <span className={styles.successDetailVal}>api.spotify.com</span>
        </div>
        <div className={styles.successDetailRow}>
          <span className={styles.successDetailKey}>Time</span>
          <span className={styles.successDetailVal}>just now</span>
        </div>
      </div>
      <div className={styles.successToggles}>
        <button type="button" className={styles.successToggle}>
          Show proven data ▾
        </button>
        <button type="button" className={styles.successToggle}>
          Show raw data ▾
        </button>
      </div>
      <button type="button" className={styles.successBackBtn}>
        Back to Plugins
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared — tab bar                                                            */
/* -------------------------------------------------------------------------- */

function TabBar({ active }: { active: 'plugins' | 'settings' | 'about' }) {
  return (
    <div className={styles.tabBar}>
      <TabBarItem icon="📦" label="Plugins" isActive={active === 'plugins'} />
      <TabBarItem icon="⚙️" label="Settings" isActive={active === 'settings'} />
      <TabBarItem icon="ℹ️" label="About" isActive={active === 'about'} />
    </div>
  );
}

function TabBarItem({ icon, label, isActive }: { icon: string; label: string; isActive: boolean }) {
  return (
    <div className={`${styles.tabBarItem} ${isActive ? styles.tabBarItemActive : ''}`}>
      <span aria-hidden>{icon}</span>
      <span className={styles.tabBarLabel}>{label}</span>
    </div>
  );
}
