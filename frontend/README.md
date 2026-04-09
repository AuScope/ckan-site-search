# Frontend — CKAN Site Search UI

Angular application providing a minimalistic search interface across multiple CKAN data repositories.

## Quick Start

```bash
npm install
npm start
```

App: http://localhost:4200

## Project Structure

```
src/app/
├── app.ts / app.html          # Root component with router outlet
├── app.config.ts               # App configuration (providers)
├── app.routes.ts               # Route definitions
├── components/
│   └── search-bar/             # Reusable search input component
├── pages/
│   ├── home/                   # Landing page with centered search
│   └── results/                # Search results page
├── services/
│   └── api.service.ts          # Backend API client
├── models/
│   └── search.ts               # TypeScript interfaces for search
└── environments/
    ├── environment.ts          # Dev config (localhost:8000)
    └── environment.prod.ts     # Production config
```

## Architecture

- Standalone components with lazy-loaded routes
- Central `ApiService` for all backend communication
- Environment-based API URL configuration
- Shared `SearchBar` component used on both home and results pages
