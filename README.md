# 🎯 Poke Port AI

A sophisticated Pokemon card portfolio management application that leverages AI and modern web technologies to help collectors track, analyze, and share their card collections with a thriving community.

![Poke Port AI Demo](https://poke-port-ai.obekt.com/)

## 🚀 Live Demo

**Production URL**: [https://poke-port-ai.obekt.com/](https://poke-port-ai.obekt.com/)

Experience the full power of AI-driven Pokemon card recognition and social portfolio management.

## ✨ Key Features

### 🤖 AI-Powered Card Recognition
- **OpenAI GPT-4o Vision**: Advanced card identification with 60%+ confidence threshold
- **Camera Integration**: Real-time card scanning with live preview
- **Official Image Replacement**: User photos used for recognition only, official Pokemon TCG API images for display
- **Automatic Market Integration**: Price lookup and official image fetching after recognition

### 📊 Portfolio Management
- **Smart Card Collection**: CRUD operations with advanced filtering and sorting
- **Real-time Market Data**: Live pricing from Pokemon TCG API and TCGPlayer
- **Portfolio Analytics**: Value tracking, performance metrics, and trend analysis
- **Multiple View Modes**: Grid and list layouts optimized for different use cases

### 📈 Market Analysis & Trends
- **Interactive Charts**: Real-time price trends using Recharts visualization
- **Historical Data**: 6-month price history with detailed trend analysis
- **Trading Volume**: Monthly activity tracking with comprehensive analytics
- **Market Dashboard**: Live market cap, daily volume, and top performers
- **Performance Tracking**: Top gaining cards with price change indicators

### 🌟 Social Platform Features
- **Public Portfolios**: Share collections with the community
- **Community Discovery**: Browse trending and popular portfolios
- **Engagement System**: Like and comment on public portfolios
- **Profile Management**: Custom display names, bios, and privacy settings
- **View Analytics**: Track portfolio views and community engagement
- **Social Sharing**: External platform integration (Twitter, Facebook, LinkedIn)

### 🎨 Modern UI/UX
- **Collectr-Inspired Design**: Blue/purple gradients with glassmorphism effects
- **Mobile-First**: Responsive design with touch-friendly interactions
- **Component Library**: Consistent design system using shadcn/ui
- **Card-Based Navigation**: Intuitive portfolio and trending card interactions
- **Smooth Animations**: Hover effects and seamless page transitions

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** + **shadcn/ui** for modern, responsive design
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Vite** for lightning-fast development and optimized builds
- **Radix UI** primitives for accessible component foundations

### Backend
- **Node.js** + **Express.js** for robust API server
- **TypeScript** with ES modules for modern development
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless for scalable data storage
- **Multer** for secure file upload handling (50MB limit)

### AI & External Services
- **OpenAI GPT-4o** for advanced image recognition
- **Pokemon TCG API** for official card data and images
- **TCGPlayer API** for real-time market pricing
- **Replit OAuth** for secure, seamless authentication

## 🏗 Architecture Overview

### Data Flow
1. **Card Recognition**: User photos → OpenAI API → Card identification → Official image replacement
2. **Portfolio Management**: Database storage → Real-time updates → Client-side filtering
3. **Market Integration**: External APIs → Price aggregation → Live trend visualization
4. **Social Features**: Public profiles → Community feeds → Engagement tracking

### Security & Performance
- **Authentication**: Session-based auth with Replit OAuth integration
- **Data Validation**: Zod schemas for type-safe API operations
- **Image Processing**: Automatic compression and optimization
- **Database Optimization**: Efficient queries with Drizzle ORM
- **Caching Strategy**: React Query for optimal data fetching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon serverless)
- OpenAI API key for card recognition

### Environment Setup
```bash
# Required environment variables
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_app_id
REPLIT_DOMAINS=your_deployment_domains
```

### Installation & Development
```bash
# Install dependencies
npm install

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Use Replit OAuth for instant, secure authentication
2. **Scan Cards**: Use the camera to scan Pokemon cards with AI recognition
3. **Build Portfolio**: Organize your collection with smart categorization
4. **Go Social**: Make your portfolio public and join the community

### Community Features
1. **Profile Setup**: Click your username → Profile Settings
2. **Make Public**: Toggle "Public Portfolio" in privacy settings
3. **Community Browse**: Visit Community tab to discover collections
4. **Engage**: Like and comment on portfolios you find interesting

### Portfolio Management
- **Add Cards**: Camera scan or manual entry with AI assistance
- **Track Value**: Real-time market prices and portfolio analytics
- **Filter & Sort**: Advanced search with multiple criteria
- **Market Analysis**: Click any card for detailed price trends

## 🔧 Development

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript schemas
├── components.json  # shadcn/ui configuration
└── package.json     # Dependencies and scripts
```

### Key Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run db:push` - Apply database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

### API Endpoints
- `GET /api/cards` - Retrieve user's card collection
- `POST /api/cards/scan` - AI-powered card recognition
- `GET /api/portfolio/stats` - Portfolio analytics
- `GET /api/community/portfolios` - Public portfolio feed
- `POST /api/portfolio/:userId/like` - Social engagement

## 🌟 Screenshots

![AI Card Recognition](./docs/card-scanner.png)
*AI-powered card recognition with live camera preview*

![Portfolio Dashboard](./docs/portfolio-dashboard.png)
*Comprehensive portfolio management with market analytics*

![Community Features](./docs/community-features.png)
*Social platform with public portfolios and engagement*

![Market Analysis](./docs/market-analysis.png)
*Real-time market trends and price analysis*

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing component library (shadcn/ui)
- Maintain responsive design principles
- Write comprehensive error handling
- Include proper type definitions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o vision capabilities
- **Pokemon TCG API** for official card data
- **Replit** for seamless hosting and OAuth
- **shadcn/ui** for beautiful component library
- **Vercel** for design inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/poke-port-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/poke-port-ai/discussions)
- **Email**: support@obekt.com

---

**Copyright © 2025 ObekT Softworks** - Built with ❤️ for the Pokemon card collecting community