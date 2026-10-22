# 🏡 PropertyNest — Modern Property Rental Web App

PropertyNest is a mobile-first, high-performance property rental web application designed with modern Tailwind CSS styling, responsive layout, interactive state, privacy controls, and a backend-ready architecture.

---

## ✨ Features

- **Mobile-First Responsive UI:** Designed with bottom sheets, slide drawers, compact cards, and adaptive grids.
- **Backend-Ready Architecture:** Clean service layer (`src/services/`) isolating all data and API logic (`authService`, `propertyService`, `chatService`, `userService`, `favoriteService`).
- **Auth-Gated Actions:**
  - Login required to **Post a Property**
  - Login required to **Send Inquiries / Contact Owners**
  - Login required to **Initiate Chat**
  - Login required to **Save Favorites**
- **Contact Number Privacy:**
  - Phone numbers are masked by default.
  - Owners can toggle `showPhone` visibility in their Profile.
  - Only authenticated users can reveal phone numbers if permitted by the owner.
- **In-App Messaging:** Slide-in drawer with live conversation threads, message timestamps, and unread badges.
- **Post Property Multi-Step Modal:** 4-step wizard with real-time validation and preview.
- **Dynamic Search & Filters:** Debounced search by title/location, filter by property type, status, bedrooms, max price range, and sort order.
- **Favorites Drawer:** Persistent saved listings using localStorage with immediate counter updates.
- **Skeleton Loaders & Polished States:** Shimmer skeletons, empty state illustrations, and toast alerts.

---

## 🚀 Getting Started

### 1. Install & Run Dev Server

```bash
cd propertynest
npm run dev
```

Open your browser at `http://localhost:5173`.

### 2. Production Build

```bash
npm run build
npm run preview
```

---

## 🧪 Demo Accounts

You can log in directly using any of these test credentials (all passwords are `demo123`):

| Email | Role | Default Phone Setting |
|---|---|---|
| `owner@demo.com` | Property Owner | Phone Visible (when logged in) |
| `renter@demo.com` | Tenant / Renter | Phone Hidden |
| `karim@demo.com` | Property Owner | Phone Visible (when logged in) |
| `nasrin@demo.com` | Property Owner | Phone Hidden |
| `jahangir@demo.com` | Tenant / Renter | Phone Visible |

*Or create a new account using the **Sign Up** tab in the auth modal!*

---

## 🔌 Connecting a Real Backend

To connect a Node.js, Express, Supabase, or Firebase backend, simply modify the methods in `src/services/`:
- `src/services/authService.js` ➔ replace with real JWT/session endpoints.
- `src/services/propertyService.js` ➔ replace with REST or GraphQL endpoints.
- `src/services/chatService.js` ➔ connect WebSocket/Socket.io or database streams.
- `src/services/userService.js` ➔ connect user profile updates.
- `src/services/favoriteService.js` ➔ sync user favorites with DB.

The entire UI and state management will work seamlessly with zero changes needed in the React components.
