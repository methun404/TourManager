<div align="center">

# 🌍 Tour Manager (TureManager)
### *Smart, Offline-First Group Travel & Expense Management PWA*

[![Vue 3](https://img.shields.io/badge/Vue.js-3.5+-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.2+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.12+-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Eliminate group trip financial chaos, missing receipts, and offline headaches.</b><br>
  Track shared expenses, manage group funds, split bills equally or by sub-groups, execute peer-to-peer transfers, and vote on trip decisions—all in a native app-like experience that works flawlessly with or without internet connectivity.
</p>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the App](#running-the-app)
- [Offline-First & PWA Capabilities](#-offline-first--pwa-capabilities)
- [PDF Reporting](#-pdf-reporting)
- [Contributing](#-contributing)
- [Author & License](#-author--license)

---

## 🌟 Overview

**Tour Manager (TureManager)** is engineered specifically for groups of friends, families, travelers, and backpackers. Group trips frequently suffer from:
1. **Confusion over balances**: *"Who paid for lunch?"* *"How much do I owe the fund?"*
2. **Connectivity dropouts**: In mountains, islands, and remote destinations, internet access is intermittent.
3. **Manual calculations**: Spreadsheets are cumbersome on mobile devices and prone to human error.

**TureManager** solves all of this with an offline-resilient, role-based, real-time reactive architecture.

---

## 🚀 Key Features

### 🛡️ Dual-Role Workflow Design
- **Admin Command Center**:
  - Set total tour budget targets and individual per-member target contributions.
  - Review, approve, or decline member fund deposit requests and shared expense claims.
  - Toggle tour permissions (allow/disallow member expense requests, contribution visibility, downloads).
  - Temporarily **pause / resume** member contribution sharing when a member leaves or skips certain legs of a tour.
  - Complete **Audit Log** tracking all additions, modifications, and deletions for 100% financial transparency.
- **Member Dashboard**:
  - Live insight into individual net balance (`+` credit / `-` debt), total money deposited, and group reserve.
  - Track personal contribution progress against the target budget.
  - Submit shared group expenses or private personal expenses.
  - Initiate peer-to-peer transfers to settle debts with fellow travelers.

### 💰 Dynamic Expense Splitting & Groups
- **Category Tagging**: Organize spending across Food, Transport, Hotel, Activities, Shopping, and Custom categories.
- **Sub-Group Splitting**: Create custom subgroups (e.g. *"Scuba Divers"*, *"Car 1"*) and split specific bills strictly among involved participants.
- **Personal Expense Isolation**: Record private individual expenses without affecting group balances.

### 💸 Peer-to-Peer Fund Transfers
- Direct money transfer between any two tour members.
- Configurable approval workflow (instant execution or administrator verification).
- Real-time balance adjustment on both sender and receiver accounts.

### 📊 Real-Time Decision Polling & Alerts
- Broadcast critical announcements and reminders to all group participants.
- Create interactive democratic polls (e.g., *"Where should we eat dinner?"*, *"What time do we depart?"*).
- System device push notifications and in-app toast updates.

### 📄 Publication-Ready PDF Reports
- Generate clean, formatted financial statements with a single click.
- Powered by `jsPDF` and `jspdf-autotable` with tabular breakdown of contributors, expenses, categories, and balances.

### 🎨 Mobile-First Design & Theme
- Built from the ground up for handheld devices with responsive touch interactions, floating bottom navigation, safe-area inset support, and smooth page transitions.
- Automatic **Dark / Light mode** toggling with persistent user preference storage.

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Vue 3](https://vuejs.org/)** | Modern reactive UI framework utilizing Composition API (`<script setup>`) |
| **[Vite 8](https://vite.dev/)** | Ultra-fast build tool and developer environment with instant HMR |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Cutting-edge utility-first styling with `@tailwindcss/vite` |
| **[Pinia 3](https://pinia.vuejs.org/)** | Modular, type-safe state management across 10 specialized stores |
| **[Vue Router 4](https://router.vuejs.org/)** | Client-side routing with navigation guards for authentication & roles |
| **[Firebase 12](https://firebase.google.com/)** | Authentication (Email/Password) and Cloud Firestore database |
| **[vite-plugin-pwa 2](https://vite-pwa-org.netlify.app/)** | Progressive Web App integration, offline caching, and service worker generation |
| **[Lucide Icons](https://lucide.dev/)** | Crisp, lightweight, modern iconography |
| **[jsPDF & AutoTable](https://github.com/parallax/jsPDF)** | Client-side document generation and tabular financial report exports |
| **[NProgress](https://ricostacruz.com/nprogress/)** | Slim, elegant top-loading progress indicator on route transitions |

---

## 📁 Project Structure

```text
ture-manager/
├── public/                 # Static web assets & PWA manifest icons
│   ├── favicon.ico
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── scripts/                # Build & postinstall patches
│   └── patch-workbox.js    # Workbox path apostrophe escaping patch
├── src/
│   ├── assets/             # Global stylesheets
│   │   └── main.css        # Tailwind v4 import, custom layers & utilities
│   ├── components/         # Reusable Vue components
│   │   ├── alerts/         # AnnouncementCard, PollCard, CreateAlertModal
│   │   ├── common/         # TopHeader, BottomNav, ActionModal, Toast, SplashScreen, SyncBanner
│   │   ├── dashboard/      # StatCard, MemberList, TransferModal, ExpenseGroupManager
│   │   └── expenses/       # ExpenseItem, RequestCard, AddExpenseForm
│   ├── composables/        # Shared business logic hooks
│   │   ├── useAuth.js          # Authentication workflows
│   │   ├── useNotification.js  # Push and system notifications
│   │   ├── useOfflineSync.js   # Offline detection & sync listeners
│   │   ├── useOnlineStatus.js  # Network status tracker
│   │   ├── useTheme.js         # Dark/Light theme manager
│   │   └── useTour.js          # Tour creation, invite codes, joining
│   ├── layouts/            # Page shell wrappers
│   │   ├── AppLayout.vue   # Authenticated app shell with top/bottom bars
│   │   └── AuthLayout.vue  # Clean, centered authentication layout
│   ├── router/             # Route definitions and role-based guards
│   ├── services/           # Firebase initialization & multi-tab cache configuration
│   ├── stores/             # Pinia store modules
│   │   ├── alertStore.js
│   │   ├── auditStore.js
│   │   ├── authStore.js
│   │   ├── contributionStore.js
│   │   ├── expenseGroupStore.js
│   │   ├── expenseRequestStore.js
│   │   ├── expenseStore.js
│   │   ├── fundRequestStore.js
│   │   ├── joinRequestStore.js
│   │   ├── toastStore.js
│   │   ├── tourStore.js
│   │   └── transferStore.js
│   ├── views/              # Primary application views
│   │   ├── AdminDashboard.vue
│   │   ├── AlertsView.vue
│   │   ├── Dashboard.vue
│   │   ├── Login.vue
│   │   ├── MemberDashboard.vue
│   │   ├── PersonalSpace.vue
│   │   ├── Register.vue
│   │   ├── Settings.vue
│   │   └── Welcome.vue
│   ├── App.vue             # Root component with splash controller
│   └── main.js             # Application bootstrap & Pinia/router mounting
├── .env.example            # Template for required environment variables
├── index.html              # HTML entry point with PWA meta & splash fallback
├── package.json            # Project manifest, dependencies, and scripts
└── vite.config.js          # Vite configuration with PWA plugin & aliases
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v20.19.0` or `>=22.12.0`
- **npm**: `v10+` (or `pnpm` / `yarn`)
- A **Firebase Project** with Authentication and Cloud Firestore enabled.

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:methun404/TourManager.git
   cd TourManager
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```
   *(The automated postinstall script will configure and patch build tooling seamlessly.)*

### Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Populate the configuration with your Firebase Project credentials:

```ini
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Running the App

- **Development Server** (with Instant Hot Module Replacement):
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

- **Production Build**:
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 📶 Offline-First & PWA Capabilities

Tour Manager leverages modern service workers and Firestore's multi-tab IndexedDB persistence:
- **Zero Data Loss**: When internet connection drops, transactions and entries are written to local storage immediately.
- **Auto-Sync**: When reconnecting, pending entries automatically push to Cloud Firestore, and the UI displays a clean sync indicator.
- **App Installation**: On Chrome, Safari (iOS), Edge, and Android, users can tap *"Add to Home Screen"* to install TureManager as a standalone app with customized splash screens and app icons.

---

## 📄 PDF Reporting

Export detailed financial breakdowns anytime during or after the tour:
- Includes tour metadata, total collected funds, total spent, and remaining treasury.
- Tabular itemization of all expenses with date, payer, category, and amount.
- Comprehensive individual member contribution breakdown.

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author & License

- **Developer**: [Methun](https://github.com/methun404)
- **Repository**: [https://github.com/methun404/TourManager](https://github.com/methun404/TourManager)
- **License**: Released under the [MIT License](LICENSE).
