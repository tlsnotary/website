import "./How.css";
// import diagram from "../images/overview-pretty.png";
import diagram from "../images/overview-new.drawio.svg"

export default function How() {
  return (
    <div id="How">
      <div className="body">
        <div className="diagram-container">
          <img className="diagram" src={diagram}></img>
        </div>
        <div className="text-container">
          <h2>How it works</h2>
          <div style={{ height: "1.375rem" }} />
          <p>
            TLSVerifier leverages the widely-used TLS (Transport Layer Security) protocol to securely and privately prove a transcript of communications took place with a webserver.
          </p>
          <br />
          <p>
            The core of the TLSVerifier protocol involves splitting TLS session keys between two parties, the Prover and the Verifier. Through secure multi-party computation (MPC), the Prover's requests to a TLS-enabled webserver are encrypted and authenticated.
          </p>
          <br />
          <p>
            During the protocol neither the Prover nor Verifier are in possession of the full TLS session keys, they only hold a share of those keys. This ensures the security assumptions of TLS while enabling the Prover to prove the authenticity of the communication to the Verifier.
          </p>
          <br />
          <p>
            All of this is achieved while maintaining full privacy. The Verifier remains unaware of which webserver is being queried, and the Verifier never has access to the unencrypted communications.
          </p>
          <br />
          <p>
            Moreover, our protocol operates transparently to the webserver.
            In fact, the webserver remains unaware that this process is taking place.
          </p>
          <br />
          <p>
            Since the validation of the TLS traffic neither reveals anything about the plaintext of the TLS session nor about the Server, it is possible to outsource the MPC-TLS verification to a general-purpose TLS verifier, which we term a <em>Notary</em>. This Notary can sign (aka <em>notarize</em>) the data, making it portable in a privacy preserving way.
          </p>

        </div>
      </div>
    </div>
  );
}
