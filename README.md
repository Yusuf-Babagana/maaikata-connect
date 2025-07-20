# Ma'aikata Connect - Global Job Matching Platform

A comprehensive people-centric platform connecting job seekers (service providers) and employers (service requesters) with verified professionals across the globe, featuring international agent support for accountability and legal compliance.

## 🌟 Features

### Core Platform Features
- **Role-based Authentication**: Client, Provider, Agent, and Admin roles
- **Geo-location Matching**: Country > State > City > Neighborhood filtering
- **Professional Verification**: ID verification, OTP, and biometric validation
- **Job Management**: Post, browse, apply, and manage job opportunities
- **Rating & Feedback**: Comprehensive rating system for quality assurance
- **Complaint Resolution**: Agent-assisted dispute resolution
- **Payment Integration**: Subscription-based access for employers
- **Multi-language Support**: English, Hausa, Arabic (planned)

### User Roles

#### 🏢 **Clients (Employers)**
- Post job opportunities with detailed requirements
- Search and filter verified service providers
- Subscribe for premium access (₦500/month or regional equivalent)
- Rate and review service providers
- Report fraud or security threats

#### 👷 **Providers (Job Seekers)**
- Create comprehensive professional profiles
- Browse and apply for job opportunities
- Receive job requests and manage applications
- Build reputation through ratings and reviews
- Complete verification process

#### 🛡️ **International Agents**
- Verify user identities and credentials
- Handle complaints and disputes
- Provide emergency assistance
- Submit investigation reports
- Ensure regional compliance

#### ⚙️ **Super Admin**
- Complete system oversight and management
- Monitor platform performance and revenue
- Manage users, agents, and system configuration
- Generate analytics and reports
- Configure geo-location settings

## 🚀 Technology Stack

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth with role-based access
- **Notifications**: React-hot-toast
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- PostgreSQL database (via Supabase)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maaikata-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   DATABASE_URL="your_supabase_connection_string"
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema with the following key models:

- **User**: Core user information with role-based access
- **Job**: Job postings with location and requirement details
- **JobApplication**: Application management system
- **Rating**: User rating and feedback system
- **Complaint**: Dispute resolution and support tickets
- **Agent**: International agent management
- **Subscription**: Payment and subscription tracking
- **Notification**: System-wide notification management

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔐 Security Features

- **AES-256 Encryption**: Data encryption at rest and in transit
- **HTTPS Enforced**: Secure communication protocols
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permission system
- **Biometric Verification**: Enhanced identity verification
- **OTP Validation**: Two-factor authentication support

## 📈 Performance Requirements

- **Page Load Time**: < 2 seconds
- **Concurrent Users**: Support for 10,000+ users
- **Uptime**: 99.9% availability target
- **CDN Integration**: Global content delivery
- **Scalable Architecture**: Microservices-ready design

## 🌍 Global Features

- **Multi-country Support**: Currently supporting 12+ countries
- **Regional Compliance**: Local law and regulation adherence
- **Currency Support**: Multiple currency handling
- **Time Zone Management**: Global time zone support
- **Language Localization**: Multi-language interface (planned)

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- **Email**: support@maaikataconnect.com
- **Help Center**: [help.maaikataconnect.com](https://help.maaikataconnect.com)
- **Agent Network**: 24/7 international support available

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform development
- ✅ User authentication and roles
- ✅ Basic job matching
- ✅ Agent dashboard

### Phase 2 (Q2 2024)
- 📱 Mobile application
- 💳 Payment gateway integration
- 🔔 Real-time notifications
- 📊 Advanced analytics

### Phase 3 (Q3 2024)
- 🌐 Multi-language support
- 🤖 AI-powered job matching
- 📱 Mobile verification
- 🔗 Third-party integrations

### Phase 4 (Q4 2024)
- 🏛️ Government agency integration
- 🌍 Additional country expansion
- 📈 Enterprise features
- 🔐 Advanced security features

---

**Ma'aikata Connect** - Connecting verified professionals worldwide with accountability and trust.