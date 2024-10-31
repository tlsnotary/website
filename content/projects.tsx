export type WebsiteType = "website" | "twitter" | "github";

type Project = {
  title: string;
  tldr: string;
  links?: Partial<Record<WebsiteType, string>>;
};

export const ProjectList: Project[] = [

  {
    title: "ZKP2P",
    tldr: "Completely peer-to-peer leveraging everyday payment networks",
    links: {
      website: "https://zkp2p.xyz",
      twitter: "https://x.com/zkp2p",
      github: "https://github.com/zkp2p",
    },
  },
  {
    title: "OpenLayer (Jomo)",
    tldr: "Scale web3 through optimistic verifiable computation",
    links: {
      website: "https://www.openlayer.tech/",
      twitter: "https://x.com/OpenLayerHQ",
      github: "https://github.com/0xJomo"
    },
  },
  {
    title: "Opacity Labs",
    tldr: "The ZKP protocol for proving anything without revealing the details",
    links: {
      website: "https://www.opacity.network/",
      twitter: "https://warpcast.com/~/channel/opacity"
    },
  },
  {
    title: "vlayer",
    tldr: "Empowering web3 with Verifiable Data",
    links: {
      website: "https://www.vlayer.xyz",
      twitter: "https://x.com/vlayer_xyz",
      github: "https://github.com/vlayer-xyz"
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
];
