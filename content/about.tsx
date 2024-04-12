import { Icons } from "../components/Icons";

/**
Markdown supported for description
*/

export const ABOUT_CONTENT = {
  WHO_WE_ARE: {
    TITLE: "Who we are",
    DESCRIPTION: `TLSNotary is an open-source protocol developed by the <u>Privacy and Scaling Exploration (PSE)</u> research lab of the Ethereum Foundation.
    \nTLSNotary is not a new project; in fact, it has been around for <u>more than a decade</u>. In 2022, TLSNotary was rebuilt from the ground up in <ins>Rust</ins> incorporating state-of-the-art cryptographic protocols. This renewed version of the TLSNotary protocol offers enhanced security, privacy, and performance.
    `,
  },
  HOW_IT_WORKS: {
    TITLE: "How it works",
    DESCRIPTION: `TLSNotary is a protocol which allows people to export data from any web application and prove facts about it to a third-party in a privacy-preserving way by leveraging secure multi-party computation (MPC) to authenticate data communicated between a Prover and a TLS-enabled web server.
        <img class="w-full" src="/images/ts-notaly-diagram.svg" />
      `,

    STEPS: [
      {
        TITLE: "Step 1: Multiparty TLS Request",
        DESCRIPTION:
          "The Prover requests data from a Server over TLS while cooperating with the Verifier in secure and privacy-preserving multi-party computation (MPC).",
        icon: <Icons.GeometricPattern1 size={120} />,
      },
      {
        TITLE: "Step 2: Selective Disclosure",
        DESCRIPTION:
          "The Prover selectively discloses the data to the Verifier by redacting sensitive information prior to sharing it. Selective disclosure may involve simple redactions, or more advanced techniques such as a zero-knowledge proofs that can prove properties of redacted data without revealing the data itself.",
        icon: <Icons.GeometricPattern2 size={120} />,
      },
      {
        TITLE: "Step 3: Notarization",
        DESCRIPTION:
          "A Notary cryptographically signs commitments to the data and the server's identity. Verifiers will only accept the signed data if they trust the Notary. They can also require signed data from multiple Notaries to rule out collusion between the Prover and a Notary.",
        icon: <Icons.GeometricPattern6 size={120} />,
      },
      {
        TITLE: "Step 4: Data Verification",
        DESCRIPTION:
          "The Verifier validates the proof by verifying the origin of the data. This can be verified by inspecting the Server certificate through trusted certificate authorities (CAs). The Verifier can now make assertions about the non-redacted content of the transcript.",
        icon: <Icons.GeometricPattern3 size={120} />,
      },
    ],
  },
  GET_INVOLVED: {
    TITLE: "Get involved",
    DESCRIPTION:
      "An alpha version of the TLSNotary protocol is available for testing. We welcome folks to start playing around with it, including trying to break it!\n\nBoth codebases are 100% Rust and compile to WASM targets with an eye on deployment into browser environments.All our code is and always will be open source! Dual-licensed under Apache 2 and MIT, at your choice.\n\nWe've invested effort into making sure our code is modular and capable of evolving. We hope that others may find some of the components independently interesting and useful. Contributions are welcome!",
  },
};
