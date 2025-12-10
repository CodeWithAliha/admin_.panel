# Coffee Admin Dashboard - Setup Guide

## Overview
A professional, fully-functional coffee shop admin dashboard built with React.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Completed Modules
- **Dashboard/Home**: Real-time analytics, sales charts, trending products, and recent orders
- **Products**: Full CRUD operations for managing coffee products
- **Orders**: Create, view, and manage customer orders with status tracking
- **Users**: Admin user management with role-based access control
- **Analytics**: Comprehensive reports with revenue trends and sales metrics
- **Settings**: Customize app name, logo, theme colors, and preferences
- **Authentication**: Secure email/password authentication with Supabase

### Technical Highlights
- Clean, modular architecture with reusable components
- Professional folder structure
- Responsive design (desktop and tablet optimized)
- Smooth animations and transitions
- Modern UI with gradient backgrounds and hover effects
- Row Level Security (RLS) implemented on all database tables
- TypeScript for type safety

## Getting Started

### 1. Create an Admin Account

Since this is your first time, you need to create an admin account. You can do this in two ways:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Create a new user with your email and password
4. Copy the user's UUID
5. Go to Table Editor > profiles
6. Add a new row with:
   - `id`: The user UUID you copied
   - `email`: Your email
   - `full_name`: Your name
   - `role`: `admin`

#### Option B: Using the Sign Up API (Temporary)
You can temporarily modify the Login component to include a sign-up form, or use the Supabase API directly to create your first admin user.

### 2. Login
- Navigate to the application
- Use your created email and password
- You'll be logged into the admin dashboard

### 3. Explore the Dashboard
- **Home**: View analytics and business metrics
- **Products**: Add coffee products (Cappuccino, Latte, etc.)
- **Orders**: Create and manage customer orders
- **Users**: Add more team members (staff, managers)
- **Analytics**: View detailed reports and trends
- **Settings**: Customize the dashboard appearance

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Layout.tsx
├── pages/              # Main application pages
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Orders.tsx
│   ├── Users.tsx
│   ├── Analytics.tsx
│   ├── Settings.tsx
│   ├── Favorites.tsx
│   └── Payment.tsx
├── context/            # React Context providers
│   └── AuthContext.tsx
├── lib/                # Library configurations
│   └── supabase.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Database Schema

### Tables
- **profiles**: User profiles with roles (admin, manager, staff)
- **products**: Coffee shop products with pricing and inventory
- **orders**: Customer orders with status tracking
- **order_items**: Line items for each order
- **settings**: Application configuration
- **analytics_daily**: Daily analytics aggregation

### Security
All tables have Row Level Security (RLS) enabled with appropriate policies:
- Admins have full access
- Managers can manage products and orders
- Staff have limited access based on their role

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

## Features by Page

### Dashboard (Home)
- Total orders, customers, and sales metrics
- Sales analytics chart
- Trending products list
- Recent orders table

### Products
- Grid view of all products
- Add new products with images
- Edit existing products
- Delete products
- Stock management
- Category filtering

### Orders
- Create new orders with product selection
- View all orders in a table
- Update order status (pending, preparing, completed, cancelled)
- Order details modal
- Payment method tracking

### Users
- View all team members
- Add new users (admin only)
- Edit user roles
- Delete users (admin only)
- Role-based access control

### Analytics
- Revenue trends chart
- Top selling products
- Order status distribution
- Payment methods breakdown
- Key performance indicators

### Settings
- Customize app name
- Update logo
- Change theme colors
- Set currency and timezone

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with RLS

## Color Scheme

The dashboard uses a warm, coffee-inspired color palette:
- Primary: `#C9A58A` (Tan/Beige)
- Secondary: `#8B7355` (Brown)
- Accent: `#D4B5A0` (Light Tan)
- Background: Gradient from `#E8D5C4` to `#D4B5A0`

## Security Features

- Email/password authentication
- Row Level Security on all tables
- Role-based access control
- Secure session management
- Protected API endpoints

## Future Enhancements

Potential features to add:
- Real-time order notifications
- Email receipts for customers
- Inventory alerts for low stock
- Customer loyalty program
- Multi-location support
- Advanced reporting and exports
- Mobile app version

## Support

For issues or questions, please refer to the documentation or contact support.

## Credits

Built with modern web technologies and best practices for a production-ready admin dashboard.
