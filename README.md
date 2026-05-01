# NJO Bar - Premium Mixology & Event Management

A comprehensive event management and mixology platform built with React, TypeScript, Vite, and Supabase.

## Features

### 🎯 Core Functionality
- **Event Booking System** with date picker and recurring booking support
- **User Authentication** with role-based access (Admin, Staff, Client)
- **Admin Dashboard** with real-time analytics and management
- **Cocktail Gallery** with ratings and community features
- **Course Management** for mixology training programs
- **Inventory Management** for alcohol and supplies tracking
- **M-Pesa Payment Integration** for Kenyan payments

### ✨ New Features Added
- **📅 Date Picker**: Interactive calendar for event date selection
- **🔍 Booking Filtering**: Advanced search and filter capabilities
- **🔄 Recurring Bookings**: Support for weekly, monthly, and yearly recurring events
- **🔔 Event Reminders**: Automated reminder system for upcoming events
- **📝 Booking Notes Editing**: In-place editing of booking notes and details

### 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Radix UI, Lucide Icons, Motion
- **Payments**: M-Pesa Daraja API
- **AI Integration**: Google Gemini API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd njo-bar---premium-mixology-&-event-management
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up

#### Database Setup
1. Go to your Supabase project's SQL Editor
2. Copy and run the SQL from `supabase/schema.sql`
3. This will create all necessary tables, policies, and functions

#### Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Add your M-Pesa and Gemini API keys:
```env
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

### 3. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── AdminDashboard.tsx  # Admin analytics dashboard
│   ├── BookingManager.tsx  # Booking management with filtering
│   ├── BookingSection.tsx  # Public booking form
│   ├── EventReminders.tsx  # Reminder management system
│   ├── InventoryManager.tsx # Inventory tracking
│   ├── CocktailGallery.tsx # Cocktail showcase
│   └── ...
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   ├── supabase.ts         # Supabase client & types
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts           # TypeScript type definitions
└── ...
supabase/
└── schema.sql             # Database schema & policies
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features and management
- **Staff**: Limited management access
- **Client**: Booking and profile management only

### Row Level Security
All database tables use Supabase RLS policies to ensure proper data access control.

## 💳 Payment Integration

### M-Pesa STK Push
- Integrated with Safaricom's M-Pesa Daraja API
- Supports Kenyan mobile money payments
- Automatic payment confirmation and booking updates

## 🎨 UI/UX Features

### Date Picker
- Interactive calendar component for event selection
- Date validation and formatting
- Mobile-responsive design

### Booking Filtering
- Search by client name, event type, location
- Filter by status, date, and event type
- Real-time filtering with instant results

### Recurring Bookings
- Support for weekly, monthly, and yearly patterns
- Visual indicators for recurring events
- Automatic scheduling capabilities

### Event Reminders
- Automated reminder system for upcoming events
- Customizable reminder templates
- Email/SMS integration ready

## 🗄️ Database Schema

### Core Tables
- `profiles` - User profiles with roles
- `bookings` - Event bookings with all details
- `inventory` - Alcohol and supply inventory
- `courses` - Mixology training programs
- `cocktails` - Cocktail recipes and ratings
- `comments` & `likes` & `ratings` - Social features
- `enrollments` - Course enrollment tracking

### Key Features
- UUID primary keys
- Automatic timestamps
- Full-text search capabilities
- Real-time subscriptions
- Comprehensive indexing

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Clean and build for production
npm start            # Run the production server
npm run preview      # Preview production build
npm run lint         # Run TypeScript checks
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive error handling

## 🚀 Deployment

### Environment Setup
1. Set up production Supabase project
2. Configure production environment variables
3. Run database migrations
4. Build and deploy the application

### Production Checklist
- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Database schema deployed
- [ ] M-Pesa credentials configured
- [ ] Domain SSL certificate
- [ ] Monitoring and logging set up

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the mixology community**
