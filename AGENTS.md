# Project Agent Policy (KIMI) Delivery App

## ENTRYPOINT (Read This First)
- Open and follow: $masterPlan
- Do not start coding until you have:
  - Identified the current Phase and the NEXT SPRINT outcomes
  - Confirmed what you will change and how you will test
- Update checkboxes/notes in MASTER_PLAN.md as work is completed.

---
## Scope
- Customer mobile app: `F:\Customer App`
- Server: `F:\Delivery-App-Server`
- Goal: implement features/bugfixes safely without breaking production or changing contracts unintentionally.

## Global Safety Rules (Non-Negotiable)
- Never paste, log, or commit secrets (tokens, passwords, private keys, .env contents, service account JSON).
- Never run `git commit`, `git push`, change remotes, or deploy unless the user explicitly asks.
- Never make destructive server changes (DB writes, migrations, deletes) without an explicit backup/rollback plan and user approval.
- Preserve existing API contracts and app behavior unless the user explicitly requests a breaking change.
- Prefer small, reviewable diffs. Avoid sweeping refactors.

## Working Style
- First inspect existing code and follow the established patterns in that repo.
- If a decision affects architecture, API shape, auth flows, or deployment, ask before proceeding.
- When changing behavior, call it out clearly: what changed, why, and what to test.

---

 Kimi Code CLI - Agent Rules for Customer App

> This file contains rules and guidelines for AI assistants (Kimi) working on this project.

---

# Project Structure Standards

### Directory Organization
```
src/
├── api/               # API clients and endpoints (NEW - to be created)
│   ├── client.ts      # Axios instance with interceptors
│   ├── authApi.ts     # Authentication endpoints
│   ├── restaurantsApi.ts
│   ├── ordersApi.ts
│   └── customerApi.ts
├── components/        # Reusable UI components
│   └── ui/            # Atomic UI components (buttons, inputs, etc.)
├── constants/         # App constants, config, screen names
├── features/          # Feature-based modules
│   ├── auth/
│   ├── checkout/
│   ├── home/
│   ├── profile/
│   ├── restaurant/
│   └── tracking/
├── hooks/             # Custom React hooks (NEW - to be created)
│   ├── useAuth.ts
│   ├── useRestaurants.ts
│   └── useOrders.ts
├── navigation/        # React Navigation setup
├── store/             # Zustand stores
├── types/             # TypeScript type definitions
└── utils/             # Helper functions (NEW)
```

### Rules for New Code
- **ALWAYS** place API-related code in `src/api/`
- **ALWAYS** place custom hooks in `src/hooks/`
- **ALWAYS** place utilities in `src/utils/`
- **NEVER** add business logic directly in screen components - use hooks or stores

---

# API Integration Standards

### Base URLs
```typescript
// Development
const DEV_BASE_URL = 'http://10.0.2.2:5000';  // Android emulator
// const DEV_BASE_URL = 'http://localhost:5000';  // iOS simulator

// Staging/Production
const STAGING_BASE_URL = 'http://144.91.71.57:5000';
const PROD_BASE_URL = 'http://144.91.71.57:2400';
```

### API Client Rules
1. Use a single shared API client module (fetch or axios) and centralize auth headers + 401 handling + dev logging there.

2. **Error Handling Pattern:**
```typescript
// ALWAYS wrap API calls in try-catch
try {
  const response = await api.post('/auth/otp/request', { phone });
  return { success: true, data: response.data };
} catch (error) {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  return { success: false, error: message };
}
```

3. **React Query Pattern:**
```typescript
// Use React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['restaurants', location],
  queryFn: () => fetchRestaurants(location),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

---

# UI/UX Standards

### Design System (Theme)
```typescript
const COLORS = {
  background: '#000000',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  primary: '#00E5FF',      // Cyan accent
  secondary: '#FFB300',    // Gold/Yellow
  error: '#FF5252',
  success: '#00C853',
  text: '#FFFFFF',
  textMuted: '#9E9E9E',
  textDisabled: '#6B6B6B',
};
```

### Component Rules
1. **ALWAYS** use NativeWind classes where possible
2. **ALWAYS** use `StyleSheet.create()` for dynamic/complex styles
4. **NEVER** use inline styles for static values

### Screen Component Template
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

export const ScreenName: React.FC<Props> = ({ navigation }) => {
  // Hooks and state here
  
  return (
    <View style={styles.container}>
      {/* Content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
```

---

# State Management Rules

### Zustand Store Patterns

1. **Auth Store** (`src/store/authStore.ts`):
   - Handle token storage in AsyncStorage
   - Manage user session state
   - Provide login/logout actions

2. **Cart Store** (`src/store/cartStore.ts`):
   - Keep local cart state
   - Sync with AsyncStorage for persistence
   - Clear cart after successful order

3. **NEVER** store server data in Zustand (use React Query instead)

---

# Authentication Flow

### Current Backend Endpoints
```
POST /auth/otp/request     - Request OTP
POST /auth/otp/verify      - Verify OTP and get tokens
POST /auth/refresh-token   - Refresh access token
GET  /user                 - Get current user (requires auth)
PATCH /user                - Update user profile (requires auth)
```

### Token Storage (If Implemented)
- Access Token: AsyncStorage (@auth_token)
- Refresh Token: only if the backend/app actually supports it
- User Data: AsyncStorage (@user_data)

### Auth Flow Rules
1. **ALWAYS** verify token on app launch
2. **ALWAYS** include token in Authorization header: `Bearer <token>`
3. **NEVER** store sensitive data in plain text

---

# Testing & Quality

### Before Committing Code
1. Run TypeScript check: `npx tsc --noEmit`
2. Run ESLint: `npm run lint`
3. Test on both Android and iOS (if possible)

### Error Handling Requirements
- **ALWAYS** handle loading states
- **ALWAYS** handle error states with user-friendly messages
- **ALWAYS** add retry functionality for failed API calls

---

# Git Workflow

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`

Examples:
```
feat(auth): connect OTP verification to backend
fix(api): handle network errors in axios interceptor
refactor(home): replace mock data with real API calls
```

### Branch Naming
- Features: `feat/auth-integration`
- Fixes: `fix/api-timeout`
- Refactor: `refactor/state-management`

---

# Things I Should NOT Do

1. **NEVER** change existing component logic unless explicitly asked
2. **NEVER** modify test files directly (ask user first)
3. **NEVER** run `git commit`, `git push`, or any git mutations without explicit permission
4. **NEVER** install packages globally
5. **NEVER** modify server-side code without confirming with the user first
6. **NEVER** use mock data after API integration is complete
7. **NEVER** expose secrets, API keys, or credentials in code

---

# Things I Should ALWAYS Do

1. Prefer strong TypeScript typing; do not change tsconfig strictness unless asked.
2. **ALWAYS** add proper error handling
3. **ALWAYS** follow the existing code style
4. **ALWAYS** ask for clarification if requirements are unclear
5. **ALWAYS** keep the user informed of what I'm doing
6. **ALWAYS** test changes work before reporting completion
7. **ALWAYS** update this AGENTS.md if I add new patterns or change architecture

---

# Related Projects

### Server: `F:\Delivery-App-Server`
- Node.js + Fastify backend
- MongoDB database
- Runs on Contabo VPS (144.91.71.57)
- Staging: Port 5000
- Production: Port 2400

### GitHub Repos
- Customer App: https://github.com/deliveryapp024/Our-Customer-App
- Server: https://github.com/deliveryapp024/Delivery-App-Server

---

# Communication Preferences

When working with the user:
1. Be concise but thorough
2. Explain what I'm about to do before doing it
3. Show code examples for complex changes
4. Ask before making architectural decisions
5. Confirm completion with a summary of changes

---

*Last updated: 2026-02-07*