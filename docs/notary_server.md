---
sidebar_position: 4
---
# Run a Notary Server
This guide shows you how to run a [notary server](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server) in an Ubuntu server instance.

## Configure Server Setting
Refer to the server's [README.md](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#configuration) for instructions on how to configure the following settings.

1. The following files are needed before running a notary server.

   | File                         | Purpose                                                                                                             | File Type                                              | Compulsory         | Sample Command                                                                                                        |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
   | TLS private key              | The private key used for the notary server's TLS certificate to establish TLS connections with provers              | TLS private key in PEM format                          | Yes unless TLS is turned off | \<Generated when creating CSR for your Certificate Authority, e.g. using [Certbot](https://certbot.eff.org/)>         |
   | TLS certificate              | The notary server's TLS certificate to establish TLS connections with provers                                       | TLS certificate in PEM format                          | Yes unless TLS is turned off | \<Obtained from your Certificate Authority, e.g. [Let's Encrypt](https://letsencrypt.org/)>                           |
   | Notary signing key | The private key used by the notary server to sign the attestation | A K256 or P256 elliptic curve private key in PKCS#8 PEM format | Yes                          | `openssl genpkey -algorithm EC -out eckey.pem -pkeyopt ec_paramgen_curve:secp256k1 -pkeyopt ec_param_enc:named_curve` |
2. Expose the notary server port (specified in the config) on your server networking setting.
3. Optionally one can turn on [authorization](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#authorization), or turn off [TLS](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#tls) if TLS is handled by an external setup, e.g. reverse proxy, cloud setup.

## Using Cargo
1. Install required system dependencies.
```bash
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install libclang-dev pkg-config build-essential libssl-dev
```
2. Install rust.
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```
3. Download the notary server source code.
```bash
 mkdir ~/src; cd ~/src
 git clone https://github.com/tlsnotary/tlsn.git
```
4. Switch to your desired [released version](https://github.com/tlsnotary/tlsn/releases), or stay in the `main` branch to use the latest version (⚠️ only prover of the same version is supported for now).
```bash
git checkout tags/<version>
```
5. To configure the server setting, please refer to the server's [README.md](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#configuration).
6. Run the server.
```bash
cargo run --release --bin notary-server
```

## Using Docker
1. Install docker following your preferred method [here](https://docs.docker.com/engine/install/ubuntu/).
2. To configure the server setting, please refer to the server's [README.md](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#configuration).
3. Run the notary server docker image of your desired version (⚠️ only prover of the same version is supported for now).
```bash
docker run --init -p 127.0.0.1:7047:7047 ghcr.io/tlsnotary/tlsn/notary-server:<version>
```

## API Endpoints
Please refer to the list of all HTTP APIs [here](pathname:///swagger-ui/notary_server_api.html), and WebSocket APIs [here](https://github.com/tlsnotary/tlsn/tree/main/crates/notary/server#websocket-apis).

## PSE Development Notary Server

> **_⚠️ WARNING:_** `notary.pse.dev` is hosted for development purposes only. You are welcome to use it for exploration and development; however, please refrain from building your business on it. Use it at your own risk.

The TLSNotary team hosts a public notary server for development, experimentation, and demonstration purposes. The server is currently open to everyone, provided that it is used fairly.

We host multiple versions of the notary server: Check https://notary.pse.dev to get a list of the currently hosted versions. The version with a `-sgx` suffix run the notary server software in a Trusted Execution Environment (TEE), Intel SGX on Azure.
You can verify the software attestation by visiting `https://notary.pse.dev/<version>/info`.

To check the status of the notary server, visit the `healthcheck` endpoint at:
`https://notary.pse.dev/<version>/healthcheck`

### WebSocket Proxy Server

Because web browsers don't have the ability to make TCP connections directly, TLSNotary requires a WebSocket proxy to set up TCP connections when it is used in a browser. To facilitate the exploration of TLSNotary and to run the examples easily, the TLSNotary team hosts a public WebSocket proxy server. Note that this proxy only supports a predefined set of domains. You can view the full list of supported domains in the [websockify configuration file](https://github.com/privacy-scaling-explorations/tlsn-infra/blob/main/docker/websockify/websockify_config).

You can utilize this WebSocket proxy with the following syntax:

```
wss://notary.pse.dev/proxy?token=<domain>
```

Replace `<domain>` with the domain you wish to access (for example, `swapi.dev`).

## Running Notary Server on Windows Subsystem for Linux (WSL)

When running the Notary Server and WebSocket Proxy on Windows Subsystem for Linux (WSL), you may encounter networking issues. In older versions of Windows (prior to Windows 11 22H2), WSL uses a virtual Ethernet adapter with its own IP address, which requires additional firewall configuration.

#### For Windows Versions Prior to 11 22H2:

1. **Identify the WSL IP Address**:  
   Run the following command inside the WSL terminal:
   ```bash
   wsl hostname -I
   ```

2. **Configure Port Forwarding on the Windows Host**:  
   To forward traffic from the Windows host to the Notary Server inside WSL, set up port forwarding. Run the following PowerShell command on your Windows host, replacing `connectaddress` with the WSL IP address you retrieved in the previous step:
   ```powershell
   netsh interface portproxy add v4tov4 listenport=7047 listenaddress=0.0.0.0 connectport=7047 connectaddress=192.168.101.100
   ```

#### For Windows 11 22H2 and Later:

In newer versions of Windows (Windows 11 22H2 and above), networking has been simplified with the introduction of mirrored mode. This mode allows WSL instances to share the host’s network interface, eliminating the need for manual port forwarding configurations. You can enable mirrored mode as recommended by Microsoft [here](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking).
