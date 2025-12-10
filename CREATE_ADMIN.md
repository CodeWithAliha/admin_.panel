# Creating Your First Admin User

To use the Coffee Admin Dashboard, you need to create your first admin user. Here are the steps:

## Method 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Run the following SQL query (replace the email and password):

```sql
-- Create a new admin user
-- Replace 'admin@coffee.com' with your email
-- Replace 'your-secure-password' with your password (min 6 characters)

-- First, create the auth user (this will be done via the dashboard)
-- Go to Authentication > Users > Add User
-- Email: admin@coffee.com
-- Password: your-secure-password
-- After creating, copy the User ID (UUID) that Supabase generates

-- Then, insert the profile (replace YOUR_USER_UUID with the UUID you copied)
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID',  -- Replace with the UUID from the auth user you created
  'admin@coffee.com',
  'Admin User',
  'admin'
);
```

## Method 2: Using Supabase Dashboard (Step by Step)

### Step 1: Create Auth User
1. Go to **Authentication** > **Users** in your Supabase Dashboard
2. Click **Add User** (or **Invite user**)
3. Enter:
   - Email: `admin@coffee.com` (or your preferred email)
   - Password: Your secure password (minimum 6 characters)
   - Auto Confirm User: **Yes** (check this box)
4. Click **Create user**
5. **IMPORTANT**: Copy the User ID (UUID) that appears - you'll need this in the next step

### Step 2: Create Profile
1. Go to **Table Editor** > **profiles** table
2. Click **Insert** > **Insert row**
3. Fill in the fields:
   - `id`: Paste the User ID you copied in Step 1
   - `email`: `admin@coffee.com` (same as Step 1)
   - `full_name`: `Admin User` (or your name)
   - `role`: `admin` (important!)
4. Click **Save**

### Step 3: Login
1. Navigate to your Coffee Dashboard application
2. Use the email and password you created in Step 1
3. You should now have full admin access!

## Quick Test Login

For quick testing, you can create a test admin with these credentials:
- **Email**: `admin@coffee.com`
- **Password**: `admin123`

Follow the steps above to create this user in Supabase.

## User Roles

The system supports three roles:
- **admin**: Full access to all features (recommended for first user)
- **manager**: Can manage products and orders
- **staff**: Limited access to view and create orders

## Troubleshooting

### "Invalid login credentials"
- Make sure you created both the auth user AND the profile
- Verify the email and password match
- Check that the UUID in the profile matches the auth user ID

### "User not found"
- Make sure you created the profile entry in the `profiles` table
- Verify the `id` in the profile matches the auth user's UUID

### "Access denied"
- Check that the `role` field is set to `admin`
- Verify RLS policies are enabled on all tables

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase environment variables in `.env`
3. Ensure the database migration was applied successfully
4. Check that RLS is enabled on all tables

## Next Steps

After logging in:
1. Go to **Settings** to customize your dashboard
2. Add coffee products in the **Products** section
3. Create test orders in the **Orders** section
4. Add more team members in the **Users** section
5. View analytics in the **Analytics** section

Enjoy your Coffee Admin Dashboard!
