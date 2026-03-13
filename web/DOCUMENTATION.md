# ReferEarn Platform - Comprehensive Documentation

> **Version**: 0.1.0  
> **Last Updated**: November 29, 2025  
> **Tech Stack**: Next.js 16, React 19, MongoDB, TypeScript

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Setup & Installation](#setup--installation)
7. [Environment Variables](#environment-variables)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Development Guide](#development-guide)
10. [Testing](#testing)
11. [Deployment](#deployment)

---

## Project Overview

**Paypulse** is a comprehensive referral and task-based earning platform where users can:
- Earn **50% commission** on every successful referral
- Complete tasks (watch videos, social media actions) to earn rewards
- Purchase subscription plans (Lite, Pro, Premium)
- Create advertising campaigns
- Manage credits and withdrawal requests

### Key Objectives
- Provide multiple earning streams (referrals + tasks + commission)
- Tier-based subscription system with increasing benefits
- Admin panel for managing users, guiders, tasks, and transactions
- SuperAdmin panel for managing admins, guiders, users, tasks, and transactions
- Guider role for managing ADs credit codes, and  signup credit codes

---

## Architecture

### Tech Stack

#### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: TailwindCSS 4 with custom theme
- **Icons**: Lucide React
- **State Management**: React Context API (`src/context`)

#### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

#### Development Tools
- **Language**: TypeScript 5
- **Linting**: ESLint 9
- **Package Manager**: npm

### Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin dashboard
│   │   ├── advertise/          # Ad creation page
│   │   ├── api/                # API routes
│   │   │   ├── admin/          # Admin APIs
│   │   │   ├── ads/            # Advertisement APIs
│   │   │   ├── auth/           # Authentication APIs
│   │   │   ├── guider/         # Guider role APIs
│   │   │   ├── plans/          # Subscription plans
│   │   │   ├── seed/           # Database seeding
│   │   │   └── user/           # User APIs
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── advertise/      # Ad management
│   │   │   ├── guider/         # Guider panel
│   │   │   ├── referrals/      # Referral tracking
│   │   │   ├── settings/       # User settings
│   │   │   └── tasks/          # Task browsing
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── context/                # React context providers
│   ├── lib/                    # Utilities & database
│   │   ├── db.ts               # MongoDB connection
│   │   ├── models.ts           # Mongoose models
│   │   └── store.ts            # Mock data store
│   └── types/                  # TypeScript types
│       └── index.ts
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Features

### 1. **Multi-Tier Subscription Plans**
Three subscription tiers with varying benefits:

| Plan | Price | Referral Reward | Features |
|------|-------|-----------------|----------|
| **Lite** | ₦12,000 | (50%) | Basic dashboard, up to 50 referrals |
| **Pro** | ₦21,000 | (50%) | Advanced dashboard, unlimited referrals, marketing toolkit |
| **Premium** | ₦50,000 | (50%) | Premium features, dedicated support, exclusive webinars |

### 2. **Referral System**
- Unique referral codes for each user
- Multi-level tracking (upline/downline)
- 50% commission on direct signups
- Real-time balance updates

### 3. **Task & Ads System**
- Watch videos (YouTube, TikTok)
- Complete social media actions (WhatsApp, Facebook, Twitter, Instagram)
- Earn up to ₦1,000 per task
- Platform-specific task filtering
- Proof submission and admin approval

### 4. **Advertising Platform**
- Users can create ad campaigns
- Payment via credit codes(from guider) or referral balance or commission balance
- Target specific platforms and actions
- Cost-per-action (CPA) pricing model

### 5. **Credit System**
- Purchase credits via credit codes
- Use credits for advertising campaigns
- Admin-generated credit codes
- Transaction tracking

### 6. **Admin Dashboard**
- User management (suspend/activate)
- Task creation and approval
- Transaction oversight (payments & withdrawals)
- Platform statistics

### 7. **Guider Role**
- Generate OTP tokens for new signups
- Buy credits in bulk
- Create and distribute credit codes
- Track code usage

---

## Database Schema

### User Model
```typescript
{
  name: String (required),
  username: String (unique, required),
  whatsapp: String (unique, required),
  password: String (hashed, required),
  profilePhoto: String,
  role: Enum ["lite", "pro", "premium", "guider", "superadmin", "admin"],
  referralCode: String (unique),
  uplinerId: ObjectId (ref: User),
  referralBalance: Number (default: 0),
  taskBalance: Number (default: 0),
  credits: Number (default: 0),
  isSuspended: Boolean (default: false),
  createdAt: Date
}
```

### OTP Token Model
```typescript
{
  code: String (unique, required),
  creatorId: ObjectId (ref: User, required),
  status: Enum ["unused", "used"],
  usedBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Credit Code Model
```typescript
{
  code: String (unique, required),
  value: Number (required),
  creatorId: ObjectId (ref: User, required),
  status: Enum ["unused", "used"],
  usedFor: String,
  usedAt: Date,
  createdAt: Date
}
```

### Transaction Model
```typescript
{
  userId: ObjectId (ref: User, required),
  amount: Number (required),
  type: Enum ["credit_purchase", "withdrawal"],
  hash: String,
  status: Enum ["pending", "approved", "rejected"],
  createdAt: Date
}
```

### Task Model
```typescript
{
  title: String (required),
  description: String,
  reward: Number (required),
  type: Enum ["video", "social", "action"],
  platform: Enum ["whatsapp", "facebook", "twitter", "tiktok", "instagram", "youtube", "all"],
  link: String,
  image: String,
  targetTiers: Array<String> (default: ["lite", "pro", "premium"]),
  expiryDate: Date,
  createdAt: Date
}
```

### UserTask Model
```typescript
{
  userId: ObjectId (ref: User, required),
  taskId: ObjectId (ref: Task, required),
  status: Enum ["pending", "approved", "rejected"],
  proof: String,
  submittedAt: Date
}
```

### Plan Model
```typescript
{
  name: String (unique, required),
  displayName: String (required),
  price: Number (required),
  referralReward: Number (required),
  features: Array<String>,
  durationDays: Number (default: 30),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### AdCampaign Model
```typescript
{
  userId: ObjectId (ref: User),
  contactInfo: String,
  platform: String (required),
  actionType: String (required),
  link: String (required),
  image: String,
  targetCount: Number (required),
  costPerAction: Number (required),
  totalCost: Number (required),
  creditCode: String (required),
  status: Enum ["pending", "active", "completed"],
  createdAt: Date
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### User
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/referrals` | Get user referrals | Yes |
| PUT | `/api/user/settings` | Update user profile | Yes |

### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/stats` | Platform statistics | Admin |
| GET | `/api/admin/payments` | Transaction history | Admin |
| GET | `/api/admin/tasks` | Get all tasks | Admin |
| POST | `/api/admin/tasks` | Create new task | Admin |
| PUT | `/api/admin/tasks/[id]` | Update task | Admin |
| DELETE | `/api/admin/tasks/[id]` | Delete task | Admin |

### Guider
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/guider/generate-otp` | Generate OTP token | Guider/Admin |
| GET | `/api/guider/otps` | Get all OTPs | Guider/Admin |
| POST | `/api/guider/buy-credits` | Purchase credits | Guider/Admin |
| GET | `/api/guider/codes` | Get credit codes | Guider/Admin |

### Plans
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/plans` | Get subscription plans | No |

### Ads
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ads/create` | Create ad campaign | Yes |

### Seed
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/seed` | Seed initial data | Dev only |

---

## Setup & Installation

### Prerequisites
- Node.js 20+ installed
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Refearn/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `web` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/refearn
   JWT_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Seed initial data (optional)**
   ```bash
   # Make a POST request to /api/seed
   curl -X POST http://localhost:3000/api/seed
   ```

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/refearn

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-change-this

# Optional: Production settings
NODE_ENV=development
```

> **⚠️ Security Warning**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

---

## User Roles & Permissions

### Role Hierarchy

1. **Admin** - Full platform access
   - Manage all users
   - Create/edit/delete tasks
   - Approve/reject transactions
   - View platform statistics
   - Suspend/activate users

2. **Guider** - Intermediate privileges
   - Generate OTP tokens for signups
   - Purchase credits in bulk
   - Create credit codes
   - View own downline

3. **Premium** - Highest paid tier
   - Unlimited referrals
   - Dedicated support
   - Exclusive webinars
   - Early feature access

4. **Pro** - Mid-tier subscription
   - Advanced dashboard
   - Unlimited referrals
   - Marketing toolkit
   - Priority support

5. **Lite** - Entry-level subscription
   - Basic dashboard
   - Up to 50 referrals
   - Standard support

### Permission Matrix

| Feature | Lite | Pro | Premium | Guider | Admin |
|---------|------|-----|---------|--------|-------|
| View Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Tasks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Refer Users | ✅ (max 50) | ✅ | ✅ | ✅ | ✅ |
| Create Ads | ❌ | ✅ | ✅ | ✅ | ✅ |
| Generate OTPs | ❌ | ❌ | ❌ | ✅ | ✅ |
| Buy Credits | ❌ | ❌ | ❌ | ✅ | ✅ |
| Create Tasks | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Development Guide

### Code Style Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **Components**: Functional components with TypeScript interfaces
3. **Naming**: 
   - Components: PascalCase (`UserCard.tsx`)
   - Functions: camelCase (`getUserById()`)
   - Constants: UPPER_SNAKE_CASE (`MAX_REFERRALS`)
4. **File Organization**: One component per file

### Adding a New Feature

#### Example: Adding a Withdrawal System

1. **Create the model** (`src/lib/models.ts`)
   ```typescript
   const WithdrawalSchema = new Schema({
     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
     amount: { type: Number, required: true },
     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
     createdAt: { type: Date, default: Date.now }
   });
   export const Withdrawal = models.Withdrawal || model("Withdrawal", WithdrawalSchema);
   ```

2. **Create API route** (`src/app/api/user/withdraw/route.ts`)
   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import dbConnect from "@/lib/db";
   import { Withdrawal, User } from "@/lib/models";

   export async function POST(req: NextRequest) {
     await dbConnect();
     // Implementation here
   }
   ```

3. **Add frontend page** (`src/app/dashboard/withdraw/page.tsx`)
   ```typescript
   export default function WithdrawPage() {
     // Component implementation
   }
   ```

4. **Update navigation** (`src/components/Sidebar.tsx`)

### Database Migrations

Since this uses MongoDB with Mongoose, schema changes are handled dynamically. However:

1. Always add new fields with default values
2. Use migrations for data transformations
3. Test schema changes in development first

### Authentication Flow

1. User submits login credentials
2. API validates credentials against database
3. JWT token generated with user ID and role
4. Token stored in HTTP-only cookie
5. Subsequent requests include cookie
6. Middleware validates token and extracts user info

---

## Testing

### Manual Testing Checklist

- [ ] User registration with referral code
- [ ] Login/logout functionality
- [ ] Task submission and approval flow
- [ ] Referral commission calculation
- [ ] Credit code redemption
- [ ] Ad campaign creation
- [ ] Admin user management
- [ ] Withdrawal request flow

### Testing User Accounts

Default mock users (if using `store.ts`):
- **Admin**: username `admin`, password should be set
- **Regular User**: username `alexuser`

### API Testing

Use tools like Postman or cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

---

## Deployment

### Deployment Checklist

- [ ] Set production `MONGODB_URI`
- [ ] Generate strong `JWT_SECRET`
- [ ] Enable environment variables on hosting platform
- [ ] Build the production bundle: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Deploy to hosting platform (Vercel recommended)

### Recommended Platforms

1. **Vercel** (Recommended for Next.js)
   - Automatic HTTPS
   - Global CDN
   - Easy environment variable management
   - Zero-config deployment

2. **MongoDB Atlas**
   - Free tier available
   - Automatic backups
   - Global distribution

### Deployment Steps (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard
5. Deploy: `vercel --prod`

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env.local`
- Verify network connectivity

**JWT Authentication Errors**
- Clear browser cookies
- Check `JWT_SECRET` is set
- Verify token expiration

**Build Errors**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run lint`

---

## Roadmap

### Planned Features
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Analytics dashboard
- [ ] Automated payouts
- [ ] Social login (Google, Facebook)

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is proprietary. All rights reserved.

---

## Support & Contact

For technical support or questions:
- **Email**: support@refearn.com
- **Telegram**: @ReferEarnSupport
- **WhatsApp**: [Contact Number]

---

**Last Updated**: November 29, 2025  
**Maintained By**: ReferEarn Development Team
