# Photography Portfolio – V1.0

Modern photography portfolio with a custom CMS built using **React + Vite + TypeScript** and **Firebase**.

This project was designed as a real-world, production-quality portfolio for a photographer, with a strong focus on:

- clean architecture
- performance
- scalability
- long-term maintainability

The application consists of a **public-facing portfolio** and a **protected admin CMS** for managing photos and metadata.

---

## ✨ Features

### Public

- Home page with **featured photos**
- Category-based galleries (`/portfolio/:category`)
- Single photo pages (`/photo/:slug`)
- Fast-loading images served from Firebase Storage
- Clean, minimal UI optimized for photography

### Admin (CMS)

- Secure admin access (Firebase Auth – Google provider)
- Create / edit / delete photos
- Upload images to Firebase Storage
- Metadata management:
  - title
  - slug
  - category
  - featured / published flags
- Live preview in admin panel

---

## 🧱 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Routing:** React Router
- **Backend / BaaS:** Firebase
  - Firestore (metadata)
  - Storage (images)
  - Authentication (admin access)
- **Styling:** CSS (dark theme, minimal UI)
- **State Management:** React hooks (no external state libraries)

---

## 🗂 Project Structure

src/
├── app/ # App setup, router, providers
├── pages/
│ ├── public/ # Public pages (home, galleries, photo page)
│ └── admin/ # Admin CMS pages
├── features/
│ ├── auth/ # Authentication & admin protection
│ └── photos/ # Photo domain (types, queries, services)
├── lib/ # Firebase config & helpers
├── styles/ # Global styles

Architecture follows:

- **feature-based structure**
- **clear separation of concerns**
- no Firebase logic inside UI components

---

## 🔐 Security Model

- Public users: **read-only access**
- Admin access:
  - Google Authentication
  - Email whitelist
- Firestore & Storage protected by security rules
- No secrets committed to the repository

---

## 🌍 Environment Variables

Create a `.env` file locally based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🧠 Design Philosophy

This project intentionally avoids:

over-engineering

unnecessary dependencies

premature optimizations

Instead, it focuses on:

clarity

correctness

scalability

real-world production patterns

Every decision follows the “golden rules”:

Clean code, security, clarity, and no breaking changes without reason.

## 🔮 Roadmap (Post V1.0)

SEO improvements (meta tags per photo)

Performance optimizations (URL caching, skeletons)

UI polish (animations, masonry layout)

Deployment (Firebase Hosting)

Optional integrations:

print services

analytics

multilingual content

## 📄 License

This project is currently intended for personal / portfolio use.
Licensing can be added if the project becomes public or commercial.
