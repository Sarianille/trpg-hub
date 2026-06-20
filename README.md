# TRPG Hub

A web application for text-based role-playing game (TRPG) players to track their games and monitor their monthly activity.

Juggling multiple simultaneous roleplay threads across different sites makes it easy to lose track of where your active games are, whose turn it is, how long it's been since the last post, or how active you've been in the past month. TRPG Hub keeps all of that in one place.

[Try it out](https://trpg-hub.vercel.app/)

## Features
- **Turn tracking** - quickly see which games are waiting on you vs. other players, sorted by how long they've been waiting
- **Inline notes** - add private notes to each game to keep track of important details, plot threads, or reminders directly on each game card
- **Tag-based statistics** - group games by site and see monthly breakdowns of active games, finished games, posts written, and more
- **Realtime updates** - changes sync instantly across open tabs and devices
- **Dark/light theme support**
- **Multi-language support** - Czech, Slovak, and English
- **In-app feedback** - report bugs or suggest features without leaving the app


## Tech Stack
- **Frontend** - React, TypeScript, Vite, Tailwind CSS
- **UI** - shadcn/ui, Base UI, Lucide icons
- **Backend** - Supabase (auth, Postgres, realtime, edge functions)
- **Other** - React Router, i18next

## How It Works
- **Auth & data** - Supabase handles authentication, Postgres storage, row-level security
- **Realtime sync** - Supabase handles subscriptions that push updates to all connected clients when any game changes
- **Monthly reset** - A scheduled cron job runs on the 1st of each month, purging finished games and resetting post counters
- **Feedback delivery** - The in-app feedback form invokes a Supabase edge function that sends the report via email to the developer

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Docker (runs the local Supabase stack)

### Installation
```bash
npm install
```

### Start Backend
```bash
npx supabase start
```
This will boot a full local Supabase stack (Postgres, auth, realtime, edge functions) in Docker and apply the DB schema, RLS policies, etc. from \`supabase/migrations\`. The first run may take a few minutes. Upon finishing, it prints the local API URL and anon key.

### Environment Variables
Create a `.env` file in the root of the project and add the following variables:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key printed by supabase start>
VITE_SITE_URL=http://localhost:5173
```

### Run App
```bash
npm run dev
```
Email confirmation is disabled locally, so you can sign up and log in immediately.

### Handy Commands
- \`npx supabase stop\` - stop the local stack
- \`npx supabase db reset\` - wipe and reapply migrations

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Attributions
Components from [Supabase UI](https://ui.supabase.com/) (licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)) and [shadcn/ui](https://ui.shadcn.com/) (licensed under [MIT](https://opensource.org/licenses/MIT)). Icons from [Lucide](https://lucide.dev/) (licensed under [MIT](https://opensource.org/licenses/MIT)).