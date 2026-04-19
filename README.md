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

> **Note:** This is a personal project and running it locally requires setting up a Supabase project with a specific database schema, row-level security policies, and edge functions. The setup steps below cover the frontend only.

### Prerequisites
- Node.js (v18 or later)
- Supabase account and project

### Installation
\`\`\`bash
npm install
\`\`\`

### Environment Variables
Create a \`.env\` file in the root of the project and add the following variables:
\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SITE_URL=http://localhost:5173
\`\`\`

### Running the Application Locally
\`\`\`bash
npm run dev
\`\`\`

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Attributions
Components from [Supabase UI](https://ui.supabase.com/) (licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)) and [shadcn/ui](https://ui.shadcn.com/) (licensed under [MIT](https://opensource.org/licenses/MIT)). Icons from [Lucide](https://lucide.dev/) (licensed under [MIT](https://opensource.org/licenses/MIT)).