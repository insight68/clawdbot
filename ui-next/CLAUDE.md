# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Next.js 16** implementation of the OpenClaw Control UI, migrated from the original Lit-based version (`../ui/`). This is a client-side React application that communicates with the OpenClaw Gateway via WebSocket.

**Technology Stack:**
- **Framework:** Next.js 16 with App Router and Turbopack
- **Runtime:** React 19.2.3
- **State Management:** Zustand with LocalStorage persistence
- **Styling:** CSS variables (migrated from original), planned Tailwind CSS 4
- **Theming:** next-themes for dark/light/system mode switching
- **Type System:** TypeScript with strict mode

**Key Architectural Constraint:**
All Gateway communication requires browser-only APIs (WebSocket, crypto.subtle for Ed25519). This means **all Gateway-integrated pages must be Client Components** (`'use client'` directive). Server Components can only be used for static pages (docs, marketing) that don't require Gateway access.

## Development Commands

```bash
# From ui-next directory:
pnpm install          # Install dependencies (from project root)
pnpm dev              # Start dev server (http://localhost:3001)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

**Note:** This project is part of a monorepo. The root package.json manages the workspace, but ui-next has its own package.json for Next.js-specific dependencies.

## Project Architecture

### Directory Structure

```
ui-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (console)/          # Route group for console pages (Client Components)
│   │   │   ├── layout.tsx      # Console layout with navigation
│   │   │   ├── chat/page.tsx   # Chat interface
│   │   │   ├── config/page.tsx # Configuration editor
│   │   │   └── ...             # Other console pages
│   │   ├── layout.tsx          # Root layout with Providers
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css        # Global styles with CSS variables
│   │   └── test/page.tsx       # Gateway connection testing
│   ├── components/            # React components
│   │   ├── providers.tsx      # Combines ThemeProvider + GatewayProvider
│   │   ├── theme-provider.tsx # next-themes wrapper
│   │   └── navigation.tsx     # Tab-based navigation
│   ├── contexts/              # React Context providers
│   │   └── gateway-context.tsx # Gateway instance sharing
│   ├── hooks/                 # Custom React hooks
│   │   └── use-gateway-connection.ts # Gateway lifecycle management
│   ├── lib/                   # Core libraries (migrated from ../ui/)
│   │   ├── gateway.ts         # WebSocket client (GatewayBrowserClient)
│   │   ├── device-identity.ts # Ed25519 key pair management
│   │   ├── device-auth.ts     # Device authentication & token storage
│   │   ├── browser.ts         # SSR compatibility utilities
│   │   └── navigation.ts      # Navigation constants
│   └── store/                 # Zustand state management
│       ├── use-ui-store.ts    # UI state (theme, navigation, gatewayUrl)
│       └── use-chat-store.ts  # Chat state (messages, sessions, drafts)
├── public/                    # Static assets
├── next.config.ts            # Next.js configuration
└── tsconfig.json             # TypeScript configuration
```

### Gateway Integration Architecture

The Gateway integration follows a **client-first pattern**:

1. **GatewayBrowserClient** (`src/lib/gateway.ts`)
   - Core WebSocket client with auto-reconnect
   - Manages pending request map for request/response correlation
   - Handles Ed25519 device authentication via crypto.subtle
   - Emits events: `hello-ok`, `event` frames, connection close

2. **useGatewayConnection Hook** (`src/hooks/use-gateway-connection.ts`)
   - React lifecycle wrapper around GatewayBrowserClient
   - Manages client creation/destruction in useEffect
   - Uses useRef for callbacks to prevent stale closures
   - Returns: `{ client, connected, connecting, error, hello, request }`

3. **GatewayProvider** (`src/contexts/gateway-context.tsx`)
   - React Context provider that shares Gateway instance
   - Reads `gatewayUrl` from useUIStore
   - Provides `useGateway()` hook for components
   - All Gateway-integrated components must use this hook

4. **Browser API Safety**
   - `canUseBrowserAPI()` checks for window/document/localStorage/WebSocket
   - Gateway client only instantiated in browser (check in hook)
   - crypto.subtle availability checked before device identity operations

### State Management (Zustand)

**UI Store** (`src/store/use-ui-store.ts`):
- `theme`: 'light' | 'dark' | 'system'
- `chatFocusMode`, `chatShowThinking`: Chat UI flags
- `navCollapsed`, `navGroupsCollapsed`: Navigation state
- `gatewayUrl`: WebSocket URL (persisted to localStorage)
- Persisted to `openclaw-ui-storage` localStorage key

**Chat Store** (`src/store/use-chat-store.ts`):
- `sessionKey`, `sessions`: Session management
- `messages`, `toolMessages`: Message arrays
- `stream`, `streamStartedAt`: Streaming state
- `draft`, `attachments`: Compose state
- `sidebarOpen`, `sidebarContent`: Markdown sidebar
- Persisted to `openclaw-chat-storage` localStorage key (partial - only sessionKey)

### Navigation System

Tab-based navigation with grouped tabs:
- **Main tabs:** chat, home, statistics, docs
- **AI Assistant tabs:** marketing, data-processing, market-analysis, customer-service, brand-management, sentiment-monitor
- **Config tabs:** config, channels, instances, sessions, skills, logs

Navigation uses Next.js App Router with file-based routing. The `(console)` route group wraps all console pages with the navigation layout.

### Theming System

Uses CSS variables defined in `src/app/globals.css`:
- Dark theme (default): `--bg: #12141a`, `--text: #e4e4e7`, `--accent: #3b82f6`
- Light theme: `--bg: #ffffff`, `--text: #18181b`, `--accent: #3b82f6`
- Theme switching via next-themes with `data-theme` attribute

### Gateway Communication Protocol

The Gateway speaks a custom WebSocket protocol:

**Connection Flow:**
1. WebSocket connects
2. Client sends `connect` method with device auth (Ed25519 signature)
3. Gateway responds with `hello-ok` containing auth token and capabilities
4. Client stores device token for next connection

**Request/Response:**
- Frame type `req`: `{ type, id, method, params }`
- Frame type `res`: `{ type, id, ok, payload, error }`

**Events:**
- Frame type `event`: `{ type, event, payload, seq, stateVersion }`
- `connect.challenge`: Nonce for device auth replay protection

## Important Implementation Notes

### SSR Compatibility

When working with Gateway-integrated code:
1. **Always add `'use client'` directive** at the top of files that use Gateway
2. **Check `typeof window === 'undefined'`** before using browser APIs in lib files
3. **Never call Gateway methods in Server Components** - they will crash
4. **Use conditional rendering** for SSR-safe fallbacks:
   ```tsx
   {typeof window !== 'undefined' && <ClientComponent />}
   ```

### Callback Stability in Hooks

The `useGatewayConnection` hook uses useRef to store callbacks and prevent recreation on every render:
```typescript
const optionsRef = useRef(options);
optionsRef.current = options;
```

This pattern allows callbacks to always access the latest options without triggering effect re-runs.

### Memory Management

- Gateway client is cleaned up in useEffect return function
- `client.stop()` closes WebSocket and flushes pending requests
- `clientRef.current = null` prevents dangling references

### Migration from Original Lit UI

This implementation was migrated from `../ui/` (Lit + Vite). Key changes:
- **LitElement → React Components:** Custom elements become React components
- **@state() decorators → Zustand stores:** Reactive state moved to global state
- **Controllers → Hooks:** Business logic migrated to custom hooks
- **Views → App Router pages:** Page components moved to `app/` directory
- **CSS architecture preserved:** CSS variables and styling system maintained

## Known Limitations

1. **Inline styles in chat page** - Should be converted to CSS classes for better maintainability
2. **No streaming event handling** - Chat page doesn't yet handle Gateway streaming events
3. **No error boundaries** - App-wide error boundary not yet implemented
4. **Limited testing** - No test files yet (original has Vitest + Playwright tests)

## Working with This Codebase

When modifying Gateway integration:
- Test in browser environment only (Gateway won't connect in SSR)
- Check both dark and light themes for visual consistency
- Verify localStorage persistence works across page reloads
- Test reconnection scenarios (Gateway restart, network changes)

When adding new pages:
- Use `(console)` route group for Gateway-integrated pages
- Add to `TAB_GROUPS` in `src/lib/navigation.ts` for navigation
- Include in `titleForTab()` and `subtitleForTab()` functions
- Mark with `'use client'` if using Gateway hooks

When debugging connection issues:
- Check browser console for `[GatewayProvider]` log messages
- Verify `gatewayUrl` in localStorage (`openclaw-ui-storage` key)
- Check Network tab for WebSocket connection status
- Look for device auth tokens in localStorage (`openclaw-device-identity-v1`)
