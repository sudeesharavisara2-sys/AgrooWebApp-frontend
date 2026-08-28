# Agroo Frontend

React + TypeScript (Vite) frontend for the Agroo Spring Boot backend.

## Stack

- React 18 + TypeScript, built with Vite
- Tailwind CSS
- React Router v6
- Axios (centralized client with JWT interceptor + unified error handling)
- @stomp/stompjs + sockjs-client (live chat over WebSocket/STOMP)

## 1. Install

```bash
npm install
```

## 2. Configure the API URL

```bash
cp .env.example .env
```

`.env`:
```
VITE_API_BASE_URL=http://localhost:8081
```

Change this if your Spring Boot backend runs on a different host/port.

## 3. Backend CORS note

Your `SecurityConfig` currently allows origins `http://localhost:3000` and
`http://localhost:4200`. This app's dev server (`vite.config.ts`) is set to
run on port **3000** to match that out of the box. If you change the Vite
port, add it to `configuration.setAllowedOrigins(...)` in `SecurityConfig.java`
and restart the backend.

## 4. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000. Make sure the Spring Boot app is running on
`http://localhost:8081` (or whatever you set `VITE_API_BASE_URL` to).

## 5. Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

## WebSocket / chat endpoint

`src/api/websocket.ts` connects to `${VITE_API_BASE_URL}/ws` via SockJS and
uses STOMP destinations `/app/chat/{groupId}/send` and
`/app/chat/{groupId}/typing`, subscribing to `/topic/group/{groupId}` and
`/topic/group/{groupId}/typing` — matching `ChatWebSocketController.java`.

**If your `WebSocketConfig` registers the STOMP endpoint under a path other
than `/ws`**, update the `WS_ENDPOINT` constant in `src/api/websocket.ts`
accordingly (the uploaded backend didn't include `WebSocketConfig.java`'s
contents, so this is the one thing to double check against your actual
endpoint registration).

## Project structure

```
src/
  api/            Axios modules, one per backend feature (auth, products,
                  machines, posts, comments, likes, groups, messages, admin),
                  plus client.ts (interceptors) and websocket.ts (STOMP)
  types/          TypeScript types mirroring every DTO, entity, and enum
                  from the backend (com.agroo.agroo.*)
  context/        AuthContext — current user, login/register/logout state
  components/     Reusable UI: layout (Navbar, guards), and per-feature
                  cards/forms (products, machines, posts)
  pages/          Route-level views, organized by feature
  utils/          Formatting helpers (currency, dates, enum labels, image URLs)
```

## Auth flow

Register → verify OTP (emailed OTP shown in the backend's dev response
message) → logged in. JWT + refresh token are stored in `localStorage` and
attached to every request via the Axios request interceptor. A 401 response
clears the stored token and drops the user back to a logged-out state.

## Role-gated routes

- Public: home, product/machine/post browsing, product/post detail
- `REGISTERED_USER` (any logged-in user): profile, change password, create/
  edit own products & machines, posts, chat groups & messages
- `ADMIN`: `/admin/*` — dashboard, user management, prices, alerts, activity
  logs — matching `AdminController`'s `@PreAuthorize("hasRole('ADMIN')")`

## Known backend quirks reflected in the frontend

- `ProductController` has two create endpoints: multipart (`POST /api/products`,
  with images) and JSON-only (`POST /api/products/json`, no images).
  `productsApi.create()` picks the right one automatically based on whether
  you pass image files.
- Market prices (`/api/admin/prices/**`) are admin-only in the backend (there
  is no public `PriceController`), so price management lives entirely under
  `/admin/prices` in this app, even though `SecurityConfig` has a leftover
  `permitAll()` rule for a `/api/prices/**` path that no controller maps to.
- `GET /api/posts/{id}` and `GET /api/posts` work for guests (authentication
  is optional there), but `GET /api/posts/feed` requires a logged-in user —
  reflected as `/posts` (public) vs. `/feed` (protected) in this app.
