# TableBook.Me - Restaurant Management Platform

A comprehensive restaurant management platform with Retell SDK integration for automated outbound calling and booking management.

## 🚀 Features

### Core Components

#### 1. Authentication & Roles
- **Google OAuth Integration**: Secure login with Google accounts
- **Role-Based Access Control**: 
  - Admin: Full access to manage users, restaurants, and all features
  - Standard: View/manage only assigned restaurants
- **Protected Routes**: Secure admin area with authentication checks

#### 2. Restaurant Profiles
- **Complete Restaurant Information**: Name, address, contact details
- **International Support**: Country codes and dial prefixes for phone normalization
- **Retell Integration**: Linked Retell Agent ID and dedicated phone numbers
- **CRUD Operations**: Add, edit, delete, and search restaurants

#### 3. CSV Upload & Phone Normalization
- **Standardized Fields**: guest_name, phone_raw, booking_date, party_size, notes, booking_ref
- **Automatic Phone Normalization**: Converts phone_raw to E.164 format using restaurant dial prefix
- **Inline Validation**: Real-time phone number validation with error highlighting
- **Correction Interface**: Easy inline correction of invalid phone numbers

#### 4. Outbound Call Queue (Retell SDK Integration)
- **One Agent Per Restaurant**: Dedicated calling agents for each restaurant
- **Scheduled Calling Windows**: Backend-managed call scheduling (e.g., 09:30–10:30)
- **Booking Data Integration**: Passes all booking variables to Retell SDK
- **Concurrency Management**: Handles Retell account limits per restaurant
- **Call Status Tracking**: Real-time monitoring of call progress

#### 5. Dashboard & Analytics
- **Comprehensive Overview**: Total users, bookings, restaurants, and calls
- **Real-time Updates**: Live status updates for all operations
- **Advanced Filtering**: Date, status, and restaurant-based filtering
- **Call Recording Links**: Access to recorded calls for quality assurance
- **Retry Mechanisms**: Failed call retry options

## 🏗️ Architecture

### Data Models

```typescript
// Core entities
restaurants(id, name, address, contact_info, country_code, dial_prefix, retell_agent_id, retell_number)
bookings(id, restaurant_id, booking_ref, guest_name, phone_raw, phone_e164, booking_datetime, party_size, notes, status)
calls(id, booking_id, started_at, ended_at, duration_sec, recording_url, status)
call_outcomes(id, call_id, outcome, reason, new_time, new_party_size, notes_delta, created_at)
users(id, email, name, role, restaurant_ids)
```

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Hooks
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Phone Validation**: libphonenumber-js
- **CSV Processing**: PapaParse
- **File Upload**: React Dropzone

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CSVUpload.tsx    # CSV upload with validation
│   │   ├── RestaurantForm.tsx # Restaurant CRUD form
│   │   ├── CallQueue.tsx    # Call queue management
│   │   ├── LoginPage.tsx    # Authentication interface
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # All data models
│   ├── utils/               # Utility functions
│   │   └── phoneUtils.ts    # Phone number handling
│   ├── page/                # Page components
│   │   ├── admin/           # Admin pages
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── restaurants/ # Restaurant management
│   │   │   ├── users/       # User management
│   │   │   ├── bookings/    # Booking management
│   │   │   └── settings/    # System settings
│   │   └── client/          # Client-facing pages
│   ├── layout/              # Layout components
│   │   ├── admin/           # Admin layout
│   │   └── client/          # Client layout
│   └── view/                # View components
│       ├── admin/           # Admin view routing
│       └── client/          # Client view routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TableBook.Me/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Setup

Create a `.env` file in the frontend directory:

```env
# Google OAuth (for production)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Retell SDK (for production)
VITE_RETELL_API_KEY=your_retell_api_key
VITE_RETELL_API_URL=https://api.retell.com

# Backend API
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🔧 Configuration

### Phone Number Normalization

The system automatically normalizes phone numbers using restaurant-specific dial prefixes:

```typescript
// Example: UK restaurant with +44 prefix
const result = normalizePhoneNumber("07123456789", "+44", "GB");
// Result: { isValid: true, phone_e164: "+447123456789" }
```

### CSV Upload Format

Required CSV columns for booking uploads:

```csv
guest_name,phone_raw,booking_date,party_size,notes,booking_ref
John Doe,07123456789,2024-01-15,4,Window seat preferred,REF001
Jane Smith,07123456790,2024-01-16,2,Vegetarian options,REF002
```

### Retell Integration

Each restaurant requires:
- **Retell Agent ID**: Unique identifier for the calling agent
- **Dedicated Phone Number**: Restaurant-specific phone number for outbound calls

## 🔒 Security Features

- **Protected Routes**: Admin area requires authentication
- **Role-Based Access**: Different permissions for admin vs standard users
- **Secure API Keys**: Environment variable storage for sensitive data
- **Input Validation**: Comprehensive validation for all user inputs
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 📱 Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Large touch targets for mobile users
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 AA compliant

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build verification
npm run build
```

## 🚀 Deployment

### Build Process

1. **Production Build**
   ```bash
   npm run build
   ```

2. **Deploy to CDN/Server**
   - Upload `dist/` folder contents
   - Configure server for SPA routing
   - Set up environment variables

### Server Configuration

For SPA routing, ensure your server redirects all routes to `index.html`:

```nginx
# Nginx example
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔮 Future Enhancements

### Planned Features

1. **Real-time Notifications**: WebSocket integration for live updates
2. **Advanced Analytics**: Detailed reporting and insights
3. **Multi-language Support**: Internationalization (i18n)
4. **Mobile App**: React Native companion app
5. **API Documentation**: Swagger/OpenAPI integration
6. **Webhook Management**: Retell callback handling
7. **Bulk Operations**: Mass booking management
8. **Integration APIs**: Third-party system connections

### Retell Function Endpoints

Future implementation of Retell → Platform callbacks:

```typescript
// update_booking_status
// record_booking_note
// handle_call_completion
// process_voice_commands
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**TableBook.Me** - Revolutionizing restaurant management with intelligent automation.
