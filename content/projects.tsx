export type WebsiteType = "website" | "twitter" | "github";

type Project = {
  title: string;
  tldr: string;
  links?: Partial<Record<WebsiteType, string>>;
};

export const ProjectList: Project[] = [
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
    title: "zkP2M",
    tldr: "Trustless and instant INR to USD on-ramp powered by ZK",
    links: {
      github: "https://github.com/zkP2M",
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
  {
    title: "Zkyc",
    tldr: "Trustless and instant INR to USD on-ramp powered by ZK",
    links: {},
  },
];
