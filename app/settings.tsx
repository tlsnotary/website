import { Icons } from "../components/Icons";
import { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
};

// list of links used in the app
export const LINKS = {
  DISCORD: "https://discord.gg/9XwESXtcN7",
  GITHUB: "https://github.com/tlsnotary/tlsn",
  TWITTER: "https://github.com/tlsnotary/tlsn",
  DOCUMENTATION: "https://docs.tlsnotary.org/",
  BLOG: "#",
};

// app header navigation
export const NAVIGATION: NavItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "API",
    href: "https://tlsnotary.github.io/tlsn/",
    external: true,
  },
  {
    label: "Documentation",
    href: LINKS.DOCUMENTATION,
    external: true,
  },
];

// app footer navigation
export const SOCIALS_FOOTER: NavItem[] = [
  {
    label: "Discord",
    href: LINKS.DISCORD,
    external: true,
    icon: <Icons.Discord />,
  },
  {
    label: "GitHub",
    href: LINKS.GITHUB,
    external: true,
    icon: <Icons.Github />,
  },
  {
    label: "Twitter",
    href: LINKS.TWITTER,
    external: true,
    icon: <Icons.Twitter />,
  },
];

// app header socials
export const SOCIALS_HEADER: NavItem[] = [
  {
    label: "Discord",
    href: LINKS.DISCORD,
    external: true,
    icon: <Icons.DiscordCircle />,
  },
  {
    label: "GitHub",
    href: LINKS.GITHUB,
    external: true,
    icon: <Icons.GithubCircle />,
  },
];
