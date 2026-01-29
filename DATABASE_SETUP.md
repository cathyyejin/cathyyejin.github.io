# Database Setup Guide for Guest Book Messages

This guide will help you set up a database to store guest book messages for your wedding invitation site.

## Recommended: Supabase (PostgreSQL)

**Why Supabase?**
- ✅ Free tier with generous limits
- ✅ PostgreSQL (reliable, SQL-based)
- ✅ Easy React integration
- ✅ Real-time updates (optional)
- ✅ Built-in security (Row Level Security)
- ✅ No backend code needed

## Setup Steps

### 1. Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to finish setting up (takes ~2 minutes)

### 2. Create the Messages Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Create messages table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  pin TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages" ON messages
  FOR SELECT USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update messages (for edit functionality)
CREATE POLICY "Anyone can update messages" ON messages
  FOR UPDATE USING (true);

-- Allow anyone to delete messages (for delete functionality)
CREATE POLICY "Anyone can delete messages" ON messages
  FOR DELETE USING (true);
```

### 3. Get Your API Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (starts with `eyJ...`)

### 4. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 5. Add Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Make sure `.env` is in your `.gitignore` file!

### 6. Enable Database Functions in Code

1. Open `src/db.js`
2. Uncomment the Supabase import and code sections
3. The code is already set up to use Supabase when credentials are available

### 7. Test It Out

1. Run `npm run dev`
2. Try adding a message in the guest book
3. Check your Supabase dashboard → **Table Editor** → **messages** to see the data

## Alternative Options

### Firebase Firestore

If you prefer Firebase:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Install: `npm install firebase`
3. Create a `firebase.js` file:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config from Firebase console
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

4. Update `src/db.js` to use Firestore instead

### MongoDB Atlas

1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Use MongoDB driver or a service like Mongoose

## Current Implementation

Right now, the app uses **localStorage** as a fallback. This means:
- ✅ Works immediately without setup
- ❌ Data is only stored in the browser (not shared across devices)
- ❌ Data is lost if user clears browser data

Once you set up Supabase (or another database), the app will automatically use it instead of localStorage.

## Troubleshooting

**Messages not saving?**
- Check browser console for errors
- Verify your Supabase credentials are correct
- Make sure Row Level Security policies are set correctly

**Can't see messages?**
- Check Supabase dashboard → Table Editor
- Verify the SELECT policy allows reading
- Check browser console for errors

**Need help?**
- Supabase docs: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
