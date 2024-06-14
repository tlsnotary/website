export type WebsiteType = "website" | "twitter" | "github";

type Project = {
  title: string;
  tldr: string;
  links?: Partial<Record<WebsiteType, string>>;
};

export const ProjectList: Project[] = [

  {
    title: "ZKP2p",
    tldr: "Completely peer-to-peer leveraging everyday payment networks",
    links: {
      // website: "https://zkp2p.xyz/",
      twitter: "https://x.com/zkp2p",
      github: "https://github.com/zkp2p",
    },
  },
  {
    title: "OpenLayer/Jomo Labs",
    tldr: "Scale web3 through optimistic verifiable computation",
    links: {
      twitter: "https://x.com/OpenLayerHQ",
    },
  },
  {
    title: "ZeroTrustBounty",
    tldr: "A trustless bug bounty platform with redacted bug reports & guaranteed payments to whitehats.",
    links: {
      github: "https://github.com/antojoseph/ZeroTrustBounty",
    },
  },
  {
    title: "RealReturn",
    tldr: "An open leaderboard of verified real investment returns, enabled by TLSNotary and Jomo.",
    links: {
      github: "https://github.com/chcharcharlie/realreturn",
    },
  },
  {
    title: "ComplianceNoted",
    tldr: "Compliance for on-chain private equity: manage a portfolio or a fund with an array of accounts and breathe through client reporting and compliance requirements! Privacy, efficiency and portability all in place.",
    links: {},
  },
  {
    title: "Zero Guard",
    tldr: "A decentralized zero knowledge powered AI Red Team Network that improves diversity, safety to AI through community",
    links: {
      github: "https://github.com/dingchaoz/ZEROGUARD",
    },
  },
];
