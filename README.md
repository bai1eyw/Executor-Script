# EXECUTOR - Script Automation Dashboard

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or you can modify to use SQLite)
- Git

## Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_random_secret_string
   ```

4. **Sync Database Schema**:
   ```bash
   npm run db:push
   ```

5. **Run the application**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`.

## Working with Roblox Scripts

1. Open the dashboard in your browser.
2. Go to the **Scripts Library**.
3. Select the **GrokRot Injector-Optimized Exploit**.
4. Copy the script content.
5. Paste it into your third-party Roblox injector (e.g., Synapse, Wave, Solara).
6. Click **Inject/Execute** in your Roblox executor.

## Commands Summary
- `npm install` - Installs project dependencies
- `npm run dev` - Starts both frontend (Vite) and backend (Express)
- `npm run db:push` - Updates your database schema
