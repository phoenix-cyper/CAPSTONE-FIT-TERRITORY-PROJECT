# Fit Territory

Fit Territory is a portable React + Vite fitness-adventure frontend. It runs without a backend in clearly labeled demo mode. No builder account, proprietary runtime, or application API key is required.

## Run on Windows

Install Node.js LTS (which includes npm), then open PowerShell in the extracted project folder:

```powershell
cd C:\FitTerritory
npm install
npm run dev
```

Open the localhost URL printed by Vite (normally `http://localhost:5173/`). If that port is busy, Vite selects another available port.

To open the project in VS Code:

```powershell
code .
```

If the `code` command is not available, open VS Code and choose **File > Open Folder**, then select the extracted `FitTerritory` folder.

## Build and preview

```powershell
npm run build
npm run preview
```

Vite writes the production site to `dist`. The preview command prints a local URL for testing that build.

## Backend configuration

Copy `.env.example` to `.env` in the project root and edit the values:

```powershell
Copy-Item .env.example .env
```

- `VITE_API_BASE_URL` is the single backend base URL. The documented local example is `http://localhost:5000/api`.
- `VITE_USE_MOCK_DATA=true` keeps the application in demo mode. Set it to `false` to use the API service layer. Restart the Vite server after changing environment values.
- Never put private keys or server secrets in a `VITE_` variable; Vite exposes these values to browser code.

The current application content is intentionally sample data. In API mode, backend-backed service calls should return explicit errors when the backend is unavailable; the UI must not present a failed server operation as a successful sign-in, activity verification, territory capture, coin award, or reward redemption.

### Service organization

`src/services/apiClient.js` is the only Axios client and reads the base URL from `VITE_API_BASE_URL`. Resource methods are grouped in `authService.js`, `activityService.js`, `territoryService.js`, `workoutService.js`, `leaderboardService.js`, `rewardService.js`, and `userService.js`. `coachService.js` returns deterministic local suggestions in demo mode and uses the backend in API mode.

Expected initial API contract (JSON):

| Method and path | Request | Example response |
| --- | --- | --- |
| `POST /auth/register` | `{ "name": "Jordan Lee", "email": "jordan@example.test", "password": "…" }` | `{ "user": { "id": "…", "name": "Jordan Lee" }, "accessToken": "…" }` |
| `POST /auth/login` | `{ "email": "jordan@example.test", "password": "…" }` | `{ "user": { "id": "…", "name": "Jordan Lee" }, "accessToken": "…" }` |
| `GET /auth/me` | — | `{ "user": { "id": "…", "name": "Jordan Lee" } }` |
| `GET /activities` | Optional `?from=…&to=…&cursor=…` | `{ "items": [{ "id": "…", "type": "walk", "distanceKm": 4.8, "durationSeconds": 2520, "verified": true }], "nextCursor": null }` |
| `POST /activities` | `{ "type": "walk", "startedAt": "ISO-8601", "durationSeconds": 2520, "distanceKm": 4.8, "route": [] }` | `{ "activity": { "id": "…", "verified": false, "status": "pending" } }` |
| `GET /activities/summary` | — | `{ "distanceKm": 32.7, "steps": 6284, "activeMinutes": 42, "calories": 318 }` |
| `GET /territories/nearby` | `?lat=…&lng=…` | `{ "items": [{ "id": "…", "name": "North Meadow", "captured": false }] }` |
| `POST /territories/:id/capture` | `{ "activityId": "…" }` | `{ "territory": { "id": "…", "captured": true } }` |
| `GET /workouts/plans`, `GET /workouts/exercises` | Optional filters | `{ "items": [] }` |
| `POST /workouts/:id/complete` | `{ "completedAt": "ISO-8601", "durationSeconds": 1800 }` | `{ "completion": { "id": "…" } }` |
| `GET /leaderboard` | `?period=weekly` or `monthly` | `{ "items": [{ "userId": "…", "name": "…", "distanceKm": 12.4, "rank": 1 }] }` |
| `GET /rewards`, `GET /rewards/wallet` | — | `{ "items": [] }` / `{ "balance": 0, "transactions": [] }` |
| `POST /rewards/:id/redeem` | — | `{ "redemption": { "id": "…", "status": "pending" } }` |
| `GET /users/me`, `PATCH /users/me` | Profile fields for PATCH | `{ "user": { "id": "…", "name": "…" } }` |
| `PATCH /users/me/privacy` | `{ "locationSharing": false, "leaderboardVisible": true }` | `{ "privacy": { "locationSharing": false, "leaderboardVisible": true } }` |
| `POST /coach/recommendations` | `{ "goal": "endurance", "level": "beginner", "duration": 30, "equipment": [] }` | `{ "message": "…", "plan": [] }` |

All errors should use a non-2xx HTTP status and a readable JSON body such as `{ "message": "Activity could not be verified." }`. The backend must be authoritative for identity, verification, territory capture, coin balance, and redemption.

### Authentication and privacy

The client is configured to support bearer tokens through its Axios request interceptor. For production, prefer short-lived access tokens held in memory and a refresh token in a `Secure`, `HttpOnly`, `SameSite` cookie; never persist long-lived tokens in browser storage. Add CSRF protection and credentialed CORS on the Express API if cookie-based refresh is used. The demo does not create or imply authenticated sessions. Location sharing is opt-in UI and does not transmit location.

## Modify the application

- Pages live in `src/pages/`. Routes are registered in `src/App.jsx`.
- Shared layout and navigation are in `src/components/layout/AppLayout.jsx`.
- Reusable UI elements are in `src/components/common/`.
- The map is isolated in `src/components/map/TerritoryMap.jsx`; it uses Leaflet and OpenStreetMap tiles.
- Demo content is in `src/data/demoData.js`; local demo activity records are stored in this browser only.
- Add a page by creating a component in `src/pages/`, adding a route in `src/App.jsx`, and adding a `NavLink` in `AppLayout.jsx`. Remove or replace any page by updating those same route and navigation entries; dashboard cards are independent links.
- Global responsive styling is in `src/index.css`.

## Demo behavior and external configuration

- Activity controls simulate elapsed time and distance; records are local and explicitly unverified. The demo does not create a real GPS route or issue rewards.
- The explore map uses public OpenStreetMap raster tiles and sample territory zones. Map tiles need an internet connection and should follow OpenStreetMap's usage policy. Browser location is only requested after the user selects **My location**.
- Coach recommendations are deterministic local samples unless the backend mode is selected. No AI model is connected.
- Challenges, rankings, wallet, rewards, profiles, and exercise content are examples; redemption and leaderboard data are not live.
- The map and fonts may use system fallbacks or remain unavailable offline; the rest of the app is usable.

The zip deliverable can omit `node_modules`; run `npm install` after extracting it to restore dependencies.
