# Poke Port AI 🎴

A sophisticated Pokemon card portfolio management application that leverages AI and modern web technologies to help collectors track, analyze, and enhance their card collections.

## 🌟 Live Demo

**Try it now: [https://poke-port-ai.obekt.com/](https://poke-port-ai.obekt.com/)**

## ✨ Features

### 🤖 AI-Powered Card Recognition
- **Smart Scanner**: Upload photos or use camera to instantly identify Pokemon cards
- **OpenAI Vision**: Advanced AI recognition with 60%+ confidence threshold
- **Automatic Valuation**: Real-time market price lookup after recognition
- **Multiple Formats**: Supports various card conditions and sets

### 📊 Portfolio Management  
- **Complete Collection Tracking**: Organize and manage your entire card portfolio
- **Advanced Filtering**: Filter by set, condition, rarity, and value
- **Price Change Analytics**: Track performance vs purchase price
- **Export Options**: Download your collection data
- **Multiple View Modes**: Grid and list layouts for optimal viewing

### 💹 Market Analysis
- **Real-Time Pricing**: Live market data from TCGPlayer and Pokemon TCG API
- **Interactive Charts**: 6-month price history with trend analysis
- **Trading Volume**: Monthly activity tracking with bar charts
- **Market Rankings**: Performance indicators and top movers
- **Price Alerts**: Track your collection's market performance

### 🎨 Modern User Experience
- **Mobile-First Design**: Optimized for all devices with responsive layout
- **Collectr-Inspired UI**: Clean gradients, glassmorphism effects, and smooth animations
- **Intuitive Navigation**: Bottom navigation for mobile, sidebar for desktop
- **Card Details Pages**: Comprehensive analytics for individual cards
- **Dark/Light Themes**: Automatic theme switching support

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** + **shadcn/ui** for modern component design
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Recharts** for interactive data visualization
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** + **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless hosting
- **Replit OAuth** for secure authentication
- **Multer** for image upload handling (50MB limit)

### AI & External Services
- **OpenAI GPT-4o Vision** for card recognition
- **Pokemon TCG API** for card data and pricing
- **TCGPlayer Integration** for market pricing
- **eBay API** for sold listings data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/poke-port-ai.git
   cd poke-port-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   DATABASE_URL=your_postgresql_url
   OPENAI_API_KEY=your_openai_key
   SESSION_SECRET=your_session_secret
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📱 Usage

### Scanning Cards
1. Click the **Scanner** section or camera button
2. Upload an image or use your device camera
3. AI will identify the card and fetch market data
4. Review and add to your portfolio

### Managing Portfolio
1. View all cards in the **Portfolio** section
2. Filter by set, condition, or value
3. Click any card to view detailed analytics
4. Edit card details or remove from collection

### Market Analysis
1. Check **Market** section for trending cards
2. View price histories and trading volumes
3. Compare your portfolio performance
4. Track market rankings and changes

## 🏗️ Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages (home, landing, card-details)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend application
│   ├── services/           # Business logic and external APIs
│   ├── routes.ts           # API endpoint definitions
│   └── storage.ts          # Database operations
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle database schema
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open database studio
- `npm start` - Start production server

## 🌍 Deployment

The application is designed for deployment on Replit with automatic:
- Database provisioning (PostgreSQL)
- Environment variable management
- SSL/TLS certificate handling
- Domain configuration

For other platforms, ensure you have:
- PostgreSQL database
- Environment variables configured
- Static file serving enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o Vision API
- **Pokemon Company** for the Pokemon TCG
- **TCGPlayer** for market data
- **shadcn/ui** for beautiful UI components
- **Replit** for hosting and development platform

## 📞 Support

For support, email [support@obekt.com](mailto:support@obekt.com) or create an issue on GitHub.

---

**© 2025 ObekT Softworks. All rights reserved.**

Built with ❤️ for Pokemon card collectors worldwide.