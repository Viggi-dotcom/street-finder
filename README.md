# 🍜 Street Food Finder & Rater

A hyper-local campus street food discovery and rating web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **PostgreSQL**, and **Drizzle ORM**.

---

## 📋 Prerequisites

Before running the project on a new machine, make sure you have the following installed:

1. **Node.js**: `v18.18+` or `v20+` (LTS recommended)
   - Check with:
     ```bash
     node -v
     npm -v
     ```
2. **PostgreSQL**: Installed and running locally on port `5432` (or a hosted PostgreSQL like Supabase/Neon).
3. **Git**: (Optional, for cloning).

---

## 🚀 Setup & Installation Steps

### Step 1: Clone / Copy the Repository

```bash
git clone <repository-url> street-food-finder
cd street-food-finder
```

> **Note**: If copying files manually across laptops, do **not** copy the `node_modules` or `.next` folders.

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Create the PostgreSQL Database

Open your terminal or PostgreSQL prompt (`psql`):

```bash
psql -U postgres
```

Inside the PostgreSQL shell, create the database:

```sql
CREATE DATABASE street_food_finder;
\q
```

---

### Step 4: Configure Environment Variables

Create a file named `.env.local` in the project root directory:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/street_food_finder"
```

#### Example:
If your PostgreSQL username is `postgres` and password is `root`:
```env
DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/street_food_finder"
```

*(Optional)* If your local database credentials differ, update the fallback URL in `drizzle.config.json` as well:
```json
{
  "dialect": "postgresql",
  "schema": "./src/db/schema.ts",
  "dbCredentials": {
    "url": "postgresql://<username>:<password>@127.0.0.1:5432/street_food_finder"
  }
}
```

---

### Step 5: Push Database Schema (Apply Migrations)

Run Drizzle Kit to automatically create the required `stalls` and `reviews` tables:

```bash
npx drizzle-kit push
```

You should see:
```text
[✓] Pulling schema from database...
[✓] Changes applied
```

---

### Step 6: Start the Development Server

```bash
npm run dev
```

Visit the app at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### Step 7: Seed Initial Food Stalls

The application automatically seeds 10 campus food stalls on first visit.

If you want to manually trigger seeding:

- **Windows (PowerShell)**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:3000/api/v1/seed" -Method Post
  ```
- **macOS / Linux (Bash)**:
  ```bash
  curl -X POST http://localhost:3000/api/v1/seed
  ```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server with Turbopack |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run typecheck` | Validates TypeScript types across the codebase |
| `npx drizzle-kit push` | Syncs schema changes directly to the PostgreSQL database |

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/          # Health check endpoint (GET /api/health)
│   │   │   └── v1/
│   │   │       ├── seed/        # Data seeder (POST /api/v1/seed)
│   │   │       └── stalls/      # Stall endpoints (CRUD, /near, /[id]/rate, /top-rated)
│   │   ├── globals.css          # Tailwind CSS styles
│   │   ├── layout.tsx           # Root HTML layout
│   │   └── page.tsx             # Interactive dashboard & stall listing
│   ├── components/              # UI Components (StallCard, AddStallModal, RateModal, etc.)
│   ├── db/
│   │   ├── index.ts             # PostgreSQL client pool & Drizzle ORM instance
│   │   └── schema.ts            # Drizzle table schemas (stalls, reviews)
│   ├── hooks/
│   │   └── useGeolocation.ts    # Browser GPS hook with default campus fallback
│   └── lib/
│       ├── geo.ts               # Haversine distance & walk-time calculators
│       └── validators.ts        # Zod validation schemas
├── drizzle.config.json          # Drizzle kit configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies & scripts
└── .env.local                   # Local environment variables (not committed)
```

---

## ❓ Troubleshooting

- **Database Connection Error (`ECONNREFUSED 127.0.0.1:5432`)**:
  - Ensure the PostgreSQL service is actively running on your laptop (`services.msc` on Windows or `brew services start postgresql` on macOS).
  - Double-check your username, password, and port in `.env.local`.
- **Database Does Not Exist (`database "street_food_finder" does not exist`)**:
  - Run `CREATE DATABASE street_food_finder;` inside PostgreSQL `psql`.
- **Location Permission Denied in Browser**:
  - If you deny location access, the app automatically falls back to default campus coordinates so you can still view and filter stalls.
