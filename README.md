# TableBook.Me Frontend

A modern React-based frontend for the TableBook.Me restaurant booking platform.

## 🚀 Features

### Client Features
- **Homepage**: Welcome page with feature highlights
- **Restaurant Listing**: Browse and search restaurants
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with Tailwind CSS

### Admin Features
- **Dashboard**: Overview with statistics and quick actions
- **User Management**: View and manage all users
- **Booking Management**: Handle restaurant bookings
- **Settings**: Configure application settings

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **PostCSS** - CSS processing

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── LinkButton.tsx
│   ├── layout/             # Layout components
│   │   ├── client/         # Client layout
│   │   └── admin/          # Admin layout
│   ├── page/               # Page components
│   │   ├── client/         # Client pages
│   │   └── admin/          # Admin pages
│   ├── view/               # View components
│   │   ├── client/         # Client view
│   │   └── admin/          # Admin view
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Public assets
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Client: http://localhost:4173
   - Admin: http://localhost:4173/admin

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The configuration is in `tailwind.config.js`.

### Key Features:
- Responsive design
- Dark mode support (ready)
- Custom color palette
- Component-based styling

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)
- Development server on port 4173
- React plugin enabled
- TypeScript support

### Tailwind Configuration (`tailwind.config.js`)
- Content paths configured for React components
- Extensible theme system
- PostCSS integration

## 📱 Pages

### Client Pages
- **Home** (`/`) - Welcome page with features
- **Restaurants** (`/page1`) - Restaurant listing and search

### Admin Pages
- **Dashboard** (`/admin`) - Overview and statistics
- **Users** (`/admin/users`) - User management
- **Bookings** (`/admin/bookings`) - Booking management
- **Settings** (`/admin/settings`) - Application settings

## 🔌 Components

### LinkButton
A reusable button component that renders as a link.

```tsx
<LinkButton href="/path" className="custom-classes">
  Button Text
</LinkButton>
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables
Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=TableBook.Me
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
