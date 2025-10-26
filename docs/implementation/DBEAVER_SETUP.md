# 🦫 DBeaver Connection Guide - Pro-League Database

## Database Connection Details

Your MySQL database is running in Docker and exposed on your localhost. Here are the connection details:

### Connection Information

| Field | Value |
|-------|-------|
| **Host** | `localhost` or `127.0.0.1` |
| **Port** | `3306` |
| **Database** | `pro_league` |
| **Username** | `pro_league_user` |
| **Password** | `pro_league_password` |
| **Root Password** | `root` (if you need root access) |

### Alternative Users

You have two users available:

**1. Application User (Recommended):**
- Username: `pro_league_user`
- Password: `pro_league_password`
- Permissions: Full access to `pro_league` database

**2. Root User (Admin):**
- Username: `root`
- Password: `root`
- Permissions: Full system access

## Step-by-Step DBeaver Setup

### 1. Open DBeaver and Create New Connection

1. Open **DBeaver Community**
2. Click **Database** → **New Database Connection**
   - Or click the **plug icon** (🔌) in the toolbar
   - Or press `Ctrl+Shift+N` (Windows/Linux) or `Cmd+Shift+N` (Mac)

### 2. Select MySQL Driver

1. In the "Connect to a database" dialog, select **MySQL**
2. Click **Next**

### 3. Enter Connection Details

Fill in the connection settings:

```
┌─────────────────────────────────────────┐
│ Connection Settings                     │
├─────────────────────────────────────────┤
│ Server Host:    localhost               │
│ Port:           3306                    │
│ Database:       pro_league              │
│ Username:       pro_league_user         │
│ Password:       pro_league_password     │
│                                         │
│ ☑ Save password                         │
│                                         │
│ ⚠️ IMPORTANT: See Driver Properties     │
│    tab for MySQL 8.0 fix                │
└─────────────────────────────────────────┘
```

**Detailed Fields:**
- **Server Host**: `localhost` (or `127.0.0.1`)
- **Port**: `3306`
- **Database**: `pro_league`
- **Username**: `pro_league_user`
- **Password**: `pro_league_password`
- **☑ Check "Save password"** (so you don't have to enter it every time)

### 3.5. Configure Driver Properties (IMPORTANT for MySQL 8.0)

**Before testing, you need to add connection properties:**

1. Click on the **Driver properties** tab (next to "Main")
2. Find or add these properties:

| Property | Value | Description |
|----------|-------|-------------|
| `allowPublicKeyRetrieval` | `true` | Allows retrieving public key from server |
| `useSSL` | `false` | Disables SSL for local development |

**To add a property:**
- Click **Add** button
- Enter property name and value
- Or scroll through existing properties and change values

**Alternative (URL method):**
- Stay on the **Main** tab
- Find the **URL** field at the bottom
- Change it to: `jdbc:mysql://localhost:3306/pro_league?allowPublicKeyRetrieval=true&useSSL=false`

### 4. Test Connection

1. Click **Test Connection...** button
2. If it's the first time:
   - DBeaver will ask to download MySQL drivers
   - Click **Download** and wait
3. You should see: ✅ **"Connected"** message
4. If successful, click **OK** or **Finish**

### 5. Connection Created!

Your connection should now appear in the **Database Navigator** panel on the left:
```
📦 MySQL - pro_league
  └─ 📁 pro_league
      ├─ 📁 Tables
      │   ├─ 📄 users
      │   └─ 📄 access_tokens
      ├─ 📁 Views
      ├─ 📁 Procedures
      └─ ...
```

## Troubleshooting

### ❌ Problem: "Public Key Retrieval is not allowed"

This is a MySQL 8.0 security feature. You need to allow public key retrieval.

**Solution 1: Add Driver Properties (Recommended)**
1. In connection settings, go to **Driver properties** tab
2. Add or modify these properties:
   - `allowPublicKeyRetrieval` = `true`
   - `useSSL` = `false`
3. Click **Test Connection** again

**Solution 2: Edit JDBC URL**
1. In connection settings, find the **URL** field
2. Change from:
   ```
   jdbc:mysql://localhost:3306/pro_league
   ```
   To:
   ```
   jdbc:mysql://localhost:3306/pro_league?allowPublicKeyRetrieval=true&useSSL=false
   ```
3. Click **Test Connection** again

**Why this happens:**
- MySQL 8.0 uses `caching_sha2_password` authentication
- Requires public key retrieval for secure connections
- We disable it for local development (safe for localhost)

---

### ❌ Problem: "Connection refused" or "Can't connect"

**Check if MySQL container is running:**
```bash
docker compose ps mysql
```

**Should show:**
```
NAME                 STATUS
pro-league-mysql-1   Up (healthy)
```

**If not running:**
```bash
docker compose up -d mysql
```

---

### ❌ Problem: "Access denied for user"

**Solution 1: Double-check credentials**
- Username: `pro_league_user` (no spaces)
- Password: `pro_league_password` (no spaces)

**Solution 2: Try root user**
- Username: `root`
- Password: `root`

---

### ❌ Problem: "Driver not found"

**Solution:**
1. In DBeaver, go to **Database** → **Driver Manager**
2. Find **MySQL** in the list
3. Click **Download/Update** button
4. Wait for download to complete
5. Click **OK**
6. Try connection again

---

### ❌ Problem: Port already in use

**Check what's on port 3306:**
```bash
sudo lsof -i :3306
# or
sudo netstat -tulpn | grep 3306
```

If another MySQL is running, either:
1. Stop the other MySQL service
2. Or change Docker port in `docker-compose.yml`

---

## Viewing Your Data

Once connected, you can:

### 1. View Tables
- Expand **pro_league** → **Tables**
- Right-click a table → **View Data**

### 2. Current Tables
You should see:
- **users** - User accounts
- **access_tokens** - Authentication tokens

### 3. Run Queries
- Open **SQL Editor**: Right-click database → **SQL Editor** → **New SQL Script**
- Or press `Ctrl+]` / `Cmd+]`

**Example queries:**
```sql
-- View all users
SELECT * FROM users;

-- Count users
SELECT COUNT(*) FROM users;

-- View user with tokens
SELECT u.*, t.name as token_name
FROM users u
LEFT JOIN access_tokens t ON t.tokenable_id = u.id
WHERE u.email = 'test@example.com';
```

## Quick Commands

### View Users Table
```sql
SELECT id, full_name, email, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Check Authentication Tokens
```sql
SELECT 
    t.id,
    t.name,
    u.email,
    t.created_at,
    t.expires_at
FROM access_tokens t
JOIN users u ON u.id = t.tokenable_id
ORDER BY t.created_at DESC;
```

### Count Records
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM access_tokens) as total_tokens;
```

## Connection String (for reference)

If you need a connection string format:
```
mysql://pro_league_user:pro_league_password@localhost:3306/pro_league
```

## Export Data (Optional)

To export data:
1. Right-click table → **Export Data**
2. Choose format (CSV, JSON, SQL, etc.)
3. Select destination
4. Click **Start**

## Import Data (Optional)

To import data:
1. Right-click table → **Import Data**
2. Choose source file
3. Map columns
4. Click **Start**

## Visual Studio Code Database Extension (Alternative)

If you prefer VS Code, you can also use the **MySQL** extension:

1. Install: **MySQL** by Jun Han
2. Click MySQL icon in sidebar
3. Click **+** to add connection
4. Enter same details as above
5. Connect and query directly in VS Code

## TablePlus (Alternative)

Another great tool is **TablePlus** (if you prefer):

1. Open TablePlus
2. Click **Create a new connection**
3. Select **MySQL**
4. Enter connection details
5. Click **Test** then **Connect**

## Summary

Your database is ready to use with these credentials:

```
Host:     localhost
Port:     3306
Database: pro_league
Username: pro_league_user
Password: pro_league_password
```

DBeaver will allow you to:
- ✅ Browse all tables and data
- ✅ Run SQL queries
- ✅ Edit data directly
- ✅ Export/Import data
- ✅ View relationships
- ✅ Generate ER diagrams
- ✅ Monitor queries

---

**Happy database exploring! 🦫**
