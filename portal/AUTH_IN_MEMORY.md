# In-Memory Authentication Storage

## Overview

The authentication system now uses **purely in-memory storage** for access tokens, with no persistence to localStorage or any other storage mechanism.

## Key Changes

### 1. Removed Persistence

- **Before**: Zustand store with `persist` middleware backing up to localStorage
- **After**: Pure in-memory Zustand store with no persistence

### 2. Updated Initialization Logic

- **Before**: Checked for existing tokens in localStorage, only refreshed if none found
- **After**: Always attempts to refresh tokens on app startup since no tokens are persisted

## Benefits

### Security

- **No Token Persistence**: Access tokens are never stored in localStorage, sessionStorage, or cookies
- **Memory-Only**: Tokens exist only in JavaScript memory during the session
- **Automatic Cleanup**: Tokens are automatically cleared when the page is refreshed or closed

### Privacy

- **No Browser Storage**: No authentication data left in browser storage
- **Session-Based**: Authentication is purely session-based
- **Fresh Start**: Each app session starts with a clean slate

## How It Works

### App Startup

1. App loads with no stored tokens
2. `AuthProvider` calls `auth.initialize()`
3. System attempts to refresh tokens using refresh token cookies
4. If successful, tokens are stored in memory
5. If failed, user remains unauthenticated

### During Session

- Tokens are stored in Zustand store (in-memory)
- Components can access auth state reactively
- tRPC client automatically uses in-memory tokens

### On Page Refresh/Close

- All tokens are lost (memory cleared)
- Next app load will attempt fresh token refresh
- No authentication data persists

## Usage

### Components

```tsx
import { useAuth } from '@/lib/auth/use-auth'

function MyComponent() {
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return <div>Welcome!</div>
}
```

### Programmatic Access

```tsx
import { auth } from '@/lib/auth/auth'

// Check authentication
if (auth.isAuthenticated()) {
  // User is authenticated
}

// Logout
auth.logout()
```

## Important Notes

### Session Management

- Users will need to re-authenticate on each page refresh
- Refresh tokens (cookies) are still used for automatic re-authentication
- No manual token management required

### Development vs Production

- In development: May need to log in more frequently
- In production: Refresh tokens should provide seamless experience

### Error Handling

- Failed token refresh on startup results in unauthenticated state
- Users are redirected to login when needed
- No stored authentication state to recover from

## Migration Impact

- **No Breaking Changes**: All existing auth API calls work the same
- **Enhanced Security**: No authentication data in browser storage
- **Simplified State**: Pure in-memory state management
- **Automatic Cleanup**: No need to manually clear stored tokens
