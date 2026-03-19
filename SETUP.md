# 🚀 GeoChat - Complete Setup Guide

## Quick Start (2 Minutes)

### Backend
```bash
cd backend/geochat

# Update Database.php with your MySQL credentials (lines 12-15)

# Create upload directories
mkdir -p upload postUpload groupImg groupUpload image

# Start PHP server
php -S localhost:8000
```

### Frontend
```bash
npm install

# Update src/api/config.js - replace YOUR_LOCAL_IP with your actual IP
# Example: http://192.168.1.100

npm run android  # or npm run ios
```

---

## Prerequisites

### Backend
- **PHP 7.4+** - [Download](https://www.php.net/downloads)
- **MySQL 5.7+** - [Download](https://www.mysql.com/downloads/)
- **Apache/Nginx** or PHP built-in server

### Frontend
- **Node.js 14+** - [Download](https://nodejs.org/)
- **Android Studio** (for Android) or **Xcode** (for iOS)

---

## Detailed Setup

### Step 1: Backend Setup

Navigate to backend:
```bash
cd backend/geochat
```

Create upload directories:
```bash
mkdir -p upload postUpload groupImg groupUpload image
chmod 755 upload postUpload groupImg groupUpload image
```

**Update Database Credentials:**

Edit `backend/geochat/Database.php` (lines 12-15):
```php
$host = 'localhost';           // Your database host
$db = 'geochat';               // Your database name
$user = 'root';                // Your MySQL username
$pass = 'your_password';       // Your MySQL password
```

### Step 2: Database Setup

Create database in MySQL:
```sql
CREATE DATABASE geochat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE geochat;
```

**Import Schema from MySQL Workbench:**

1. Open `backend/geochat.mwb` in MySQL Workbench
2. Go to **Database** → **Forward Engineer**
3. Follow the wizard to create tables

**Or manually run SQL:**
```bash
mysql -u root -p geochat < your_schema_file.sql
```

### Step 3: Frontend Setup

Install dependencies:
```bash
npm install
```

**Update API Configuration:**

Edit `src/api/config.js`:
```javascript
export const HOST_BASE_URL = 'http://192.168.1.100';  // Your local IP
export const API_BASE_URL = `${HOST_BASE_URL}/geochat`;
```

**Find your IP:**
- **Windows:** `ipconfig` → Look for "IPv4 Address"
- **Mac/Linux:** `ifconfig` → Look for "inet"

⚠️ **Important:** Don't use `localhost` or `127.0.0.1` on mobile devices

### Step 4: Run Application

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

---

## API Endpoints

Your project has **21 API endpoints** in `backend/geochat/`:

### Authentication
- `signin.php` - User login
- `signUp.php` - User registration
- `passwordUpdate.php` - Change password

### Chat
- `saveChat.php` - Send text message
- `load_chat.php` - Load chat history
- `saveImageChat.php` - Send image message
- `chatstatus.php` - Update message status

### Groups
- `createGroup.php` - Create group
- `load_group.php` - Get user's groups
- `group_chat.php` - Load group messages
- `saveGroupChat.php` - Send group message
- `saveGroupImgChat.php` - Send image to group
- `group_user_details.php` - Get group members

### Social Posts
- `add_post.php` - Create post
- `post.php` - Load posts/feed
- `post_chat.php` - Get post comments
- `savePostChat.php` - Add comment
- `postStatus.php` - Like/react to post

### Users & Contacts
- `load_user.php` - Load contacts/friends
- `searchUser.php` - Search users
- `addUser.php` - Add friend
- `profileUpdate.php` - Update profile
- `update_profile_picture.php` - Change profile picture

### Utility
- `loadCountry.php` - Get countries list

---

## Troubleshooting

### Database Connection Error
```
Error: Database connection failed
```

**Fix:**
1. Check MySQL is running
2. Verify credentials in `Database.php`
3. Ensure database `geochat` exists
4. Check database has tables

### Cannot Connect to API
```
Error: Cannot connect to http://192.168.1.100/geochat/...
```

**Fix:**
1. Is PHP server running? `php -S localhost:8000`
2. Correct IP in `src/api/config.js`?
3. Check firewall isn't blocking port
4. Test: `http://YOUR_IP:8000/loadCountry.php`

### File Upload Fails
```
Error: Cannot move uploaded file
```

**Fix:**
```bash
# Create directories
mkdir -p upload postUpload groupImg groupUpload

# Set permissions
chmod 755 upload postUpload groupImg groupUpload
```

### npm Install Fails
```
npm ERR! code ERESOLVE
```

**Fix:**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

### No Devices for Android
```
Error: No devices attached
```

**Fix:**
```bash
adb devices
emulator -list-avds
emulator -avd YOUR_EMULATOR_NAME
```

---

## Database Tables

Your database includes:
- `user` - User accounts
- `chat` - Messages
- `friends` - Contacts/conversation history
- `group` - Groups
- `group_user` - Group members
- `group_chat` - Group messages
- `post` - Social posts
- `post_msg` - Post comments
- `post_status` - Reactions/likes
- `country` - Countries list
- `status` - Message status types

---

## File Structure

```
backend/geochat/
├── Database.php              # Database connection
├── signin.php               # Login
├── signUp.php              # Registration
├── load_user.php           # Contacts
├── load_chat.php           # Chat history
├── saveChat.php            # Send message
├── post.php                # Social posts
├── add_post.php            # Create post
└── ... (17 more endpoints)

frontend/
├── src/api/config.js       # API configuration
├── src/screens/            # App screens
└── App.tsx                 # Main app file
```

---

## Next Steps

1. **Test API endpoints** by visiting:
   ```
   http://localhost:8000/loadCountry.php
   ```

2. **Create test user** via signup

3. **Test login** with created credentials

4. **Test chat** between two users

5. **Deploy** when ready (update IP to production server)

---

**Last Updated:** 2026-03-19  
**Database:** MySQL Workbench file (`backend/geochat.mwb`)  
**Endpoints:** 21 total
