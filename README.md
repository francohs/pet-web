# PetCare Manager - Frontend

A modern web application that allows pet owners to manage their pets' health, schedule veterinary appointments, and track vaccine and medication reminders in one place.

## Live Demo

🔗 [https://pet-web-olive.vercel.app](https://pet-web-olive.vercel.app)

## Tech Stack

- **Framework:** Vue 3 with TypeScript
- **State Management:** Pinia
- **Server State:** TanStack Query
- **Tables:** TanStack Table
- **Styling:** TailwindCSS
- **UI Components:** shadcn-vue
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Features

- JWT authentication with automatic token refresh
- Dashboard with summary cards and recent activity
- Pet management with species, breed, and birth date
- Appointment scheduling with status tracking
- Vaccine and medication reminders
- Fully responsive UI

## Project Structure

```
src/
├── api/              # Axios API modules
│   ├── client.ts     # Axios instance with interceptors
│   ├── auth.ts
│   ├── pets.ts
│   ├── appointments.ts
│   └── reminders.ts
├── components/       # Shared components
│   └── AppLayout.vue # Navigation layout
├── composables/      # Reusable composables
├── stores/           # Pinia stores
│   └── auth.ts       # Authentication store
├── types/            # TypeScript interfaces
│   └── index.ts
└── views/            # Page components
    ├── LoginView.vue
    ├── RegisterView.vue
    ├── DashboardView.vue
    ├── PetsView.vue
    ├── PetDetailView.vue
    ├── AppointmentsView.vue
    └── RemindersView.vue
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/petcare-manager-frontend.git
cd petcare-manager-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root folder:

```
VITE_API_URL=http://localhost:3000
```

### Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The app is automatically deployed to Vercel on every push to the `main` branch via GitHub Actions.

### Required GitHub Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## About

Built by Franco Hormazabal, a Full Stack Engineer with a strong background in Full Stack production systems. Currently expanding into React and AI integrations.

[linkedin.com/in/franco-hormazabal](https://www.linkedin.com/in/franco-hormazabal)
