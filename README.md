# 📰 The Investigation — Frontend

The user-facing web application for **The Investigation**, featuring an editorial design system, interactive impact mapping, and investigative workspaces.

## ⚡ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom "Editorial" Theme)
- **Auth**: Supabase Auth (SSR)
- **Visualization**: React Flow + d3-force (Impact Map)
- **Deployment**: Vercel

## ✨ Key Features

### 🗺️ Impact Map
Interactive visualization of global entity connections.
- **Force-Directed Layout**: Automatically clusters related nodes.
- **Dynamic Data**: Fetches real entities processed by the AI backend.
- **Filtering**: Filter by Person, Company, Location, etc.

### 🕵️ Investigations Workspace
Tools for journalists and analysts to track stories.
- **Case Management**: Create and manage investigation files.
- **Evidence Board**: Pin articles and notes to a case.
- **Watchlist**: Track specific entities and get alerts.

### 📰 Editorial Experience
- **Premium Design**: Serif typography (Newsreader) and clean layouts.
- **Responsive**: Fully optimized for mobile and desktop.
- **Smart Sidebar**: Context-aware sidebar showing trending impact chains.

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd newsportal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## 🏗️ Project Structure

- `src/app`: App Router pages and layouts
  - `/impact-map`: Visualization logic
  - `/investigations`: Workspace pages
  - `/article/[id]`: Article details
- `src/components`: Reusable UI components
  - `/graph`: React Flow graph components
  - `/layout`: Header, Sidebar, Footer
- `src/lib`: Utilities
  - `/supabase`: Database clients (Client & Server)
  - `/actions`: Server Actions for data mutation

## 🚀 Deployment

This project is optimized for **Vercel**.
1. Import the repository in Vercel.
2. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_...`).
3. Deploy!
