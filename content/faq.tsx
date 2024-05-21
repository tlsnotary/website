interface FAQItem {
  question: string;
  answer: string;
}

/**
Markdown supported for answer
*/
export const FAQS: FAQItem[] = [
  {
    question: "Why is TLS not sufficient for data portability?",
    answer:
      "TLS indeed signs a checksum (a Message Authentication Code, MAC) to check data integrity. However, in TLS, both the Server and the User use symmetric keys for data exchange, meaning the same key is employed for both encryption and decryption. This symmetric key usage allows a User to modify the data and retroactively compute a new checksum. As a result, this checksum alone is insufficient to guarantee data authenticity to a third party.",
  },
  {
    question: "How can I verify the data origin in a TLSNotary proof?",
    answer:
      "The proof contains the domain name and ephemeral public key of the server. A standard certificate verifier can verify whether the key is valid for the provided server name and that it chains to at least one trusted root certificate.",
  },
  {
    question: "What does “privacy-centric” exactly mean for TLSNotary?",
    answer:
      "TLSNotary does not compromise on privacy for performance reasons. It prioritizes user privacy in all its operations. The verifier only sees the data the prover decides to share. <br /><br/> If a generic notary is used to verify the TLS session, this notary only sees encrypted data and does not know what Server the Prover communicates with. The only information the Notary can see is: the time of the TLS-session, the length of the requests and responses, the number or round trips, and which cipher suite is used.",
  },
  {
    question: "What is the overhead of using TLSNotary?",
    answer:
      "The Multi-Party Computation (MPC) between the Prover and the Verifier requires significant bandwidth, orders of magnitude more than the Server's data size.",
  },
  {
    question: "Can the server detect that a TLS session is being notarized?",
    answer: `
      To the server, the TLS connection appears the same as any other connection. Only the User communicates with the Server, not the Notary or the Verifier. However, the timing patterns of TLS communication might have a different fingerprint, so through statistical analysis, specific identifying patterns might be uncovered.`,
  },
  {
    question: "Can TLSNotary be used for public data?",
    answer:
      "Yes, but for public data, a less-resource-intensive man-in-the-middle approach is more economical since the privacy features of TLSNotary are superfluous in this scenario.",
  },
  {
    question: "How can I inspect and verify a TLSNotary proof?",
    answer:
      "The easiest way is to use the proof-of-concept proof visualizer: [TLSNotary Proof Visualizer](https://tlsnotary.github.io/proof_viz/)",
  },
  {
    question: "Which TLS versions are supported?",
    answer: "TLSNotary currently supports TLS 1.2. Support for TLS 1.3 is on the roadmap.",
  },
  {
    question: "How can I use TLSNotary to verify data on-chain?",
    answer:
      "At the moment the most practical way to verify data on-chain is to prove the data directly to an off-chain application specific verifier. There are planned upgrades to make TLSNotary proofs directly verifiable on-chain.",
  },
  {
    question: "Why can a verifier trust a TLSNotary proof?",
    answer:
      "A TLSNotary proof is trustworthy because of its cryptographic integrity and its inclusion of an ephemeral key, allowing verifiers to confirm the data's origin from the claimed domain. This trust also hinges on the verifier's confidence in the data source (the server) and the validity of any redactions. Additionally, if the verifier did not conduct the TLS-MPC process themselves, they must trust in the notary's neutrality, ensuring it has not been influenced or compromised by the Prover.",
  },
  {
    question: "How does TLSNotary differ from other TLS portability approaches?",
    answer:
      "TLSNotary distinguishes itself with its dedication to open-source development and a strong emphasis on trustlessness. Developed as a public good without a business model, it fosters transparency and allows for community-driven improvements.   Unlike other solutions, TLSNotary is designed to prioritize trustlessness, thereby guaranteeing superior levels of privacy and security. It achieves this without depending on particular network assumptions or compromising on privacy or security to enhance performance. This strategy positions TLSNotary as the go-to choice for projects that place a high value on security and privacy in their TLS portability needs.",
  },
];
