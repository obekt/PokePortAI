# Poke Port AI: Pokemon Card Recognition and Portfolio Management App

## Overview

Poke Port AI is a full-stack web application that allows users to scan Pokemon cards using AI recognition, track their card portfolio, and view market analysis. The app combines computer vision technology with market data to help collectors manage and value their Pokemon card collections.

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX Preference: Modern, mobile-first design inspired by Collectr app with clean card-based layouts and intuitive navigation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints
- **Authentication**: Replit OAuth with session-based authentication
- **File Uploads**: Multer middleware for image processing
- **Development**: tsx for TypeScript execution in development

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schema definitions
- **Migrations**: Drizzle Kit for database migrations
- **Fallback**: In-memory storage implementation for development

## Key Components

### Card Scanner
- **Image Upload**: Supports camera capture and file upload (for recognition only)
- **AI Recognition**: OpenAI GPT-4o vision model for card identification
- **Official Image Replacement**: User photos only used for AI recognition, official Pokemon TCG API images used for display and storage
- **Market Integration**: Automatic price lookup and official image fetching after recognition
- **Real-time Preview**: Live camera feed with official card image replacement

### Portfolio Management
- **Card Collection**: CRUD operations for user's card collection
- **Filtering**: Filter by set, condition, and other attributes
- **View Modes**: Grid and list view options
- **Statistics**: Portfolio value tracking and analytics
- **Social Sharing**: External platform sharing with Twitter, Facebook, LinkedIn

### Market Analysis
- **Real-time Charts**: Interactive price trends using Recharts library
- **Price History**: 6-month historical price visualization with line charts
- **Trading Volume**: Monthly trading activity with bar charts
- **Market Overview**: Market cap, daily volume, top gainers dashboard
- **Data Sources**: Pokemon TCG API, TCGPlayer, and eBay integration
- **Performance Tracking**: Top performing cards with price change indicators

### Social Platform Features
- **Public Portfolios**: Users can make portfolios public for community viewing
- **Community Feed**: Browse trending and popular public portfolios
- **Portfolio Comments**: Users can comment on public portfolios
- **Portfolio Likes**: Like system for community engagement
- **Profile Management**: Custom display names, bios, and public/private settings
- **View Tracking**: Analytics for portfolio views and engagement
- **Community Navigation**: Dedicated community page with portfolio discovery

### UI/UX Features
- **Modern Collectr-inspired Design**: Blue/purple gradients, glassmorphism effects, hover animations
- **Card-based Navigation**: Click portfolio or trending cards to view detailed analytics
- **Dedicated Card Details Page**: Separate page with comprehensive price charts and market data
- **Mobile-optimized**: Bottom navigation, responsive grid layouts, touch-friendly interactions
- **Component Library**: Consistent design system using shadcn/ui with custom Collectr styling

## Data Flow

1. **Card Scanning Flow**:
   - User uploads/captures card image (for recognition only)
   - Image converted to base64 and sent to OpenAI API
   - AI returns card recognition data
   - Market price lookup and official image fetching performed
   - Official Pokemon TCG API image replaces user's photo
   - Card saved to database with official image and recognition results

2. **Portfolio Flow**:
   - Cards retrieved from database
   - Client-side filtering and sorting
   - Real-time updates using React Query
   - Click card → Navigate to dedicated card details page
   - CRUD operations through REST API

3. **Market Data Flow**:
   - External API integration for pricing data
   - Trending cards displayed on home page
   - Click card → Navigate to detailed analytics page
   - Comprehensive charts and market data on card details page

4. **Navigation Flow**:
   - Home page: Scanner, Portfolio, Trending Cards
   - Card Details page: Full analytics, price history, volume charts
   - Mobile-optimized routing with smooth transitions

## External Dependencies

### Core Technologies
- **React Ecosystem**: React, React DOM, React Query
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Express.js, TypeScript, tsx
- **Database**: Drizzle ORM, PostgreSQL, Neon serverless
- **AI Integration**: OpenAI API for image recognition
- **Charting**: Recharts for market trend visualization

### Development Tools
- **Build System**: Vite with React plugin
- **Code Quality**: TypeScript for type safety
- **UI Components**: shadcn/ui component library
- **File Processing**: Multer for image uploads (50MB limit)
- **Routing**: Wouter for lightweight routing

### External Services
- **Database Hosting**: Neon PostgreSQL serverless
- **AI Vision**: OpenAI GPT-4o for card recognition (60%+ confidence required)
- **Market Data**: Pokemon TCG API with TCGPlayer pricing integration
- **Pricing Sources**: TCGPlayer, eBay sold listings, Pokemon TCG API
- **Image Storage**: File system with automatic compression

## Demo Deployment
- **Production URL**: https://poke-port-ai.obekt.com/
- **Repository**: GitHub with comprehensive README
- **Copyright**: © 2025 ObekT Softworks displayed on all pages

## Deployment Strategy

### Development Environment
- **Local Database**: Uses DATABASE_URL environment variable
- **Hot Reload**: Vite development server with HMR
- **API Development**: Express server with live reload
- **Environment**: Development mode with debug logging

### Production Build
- **Frontend**: Vite builds optimized React bundle
- **Backend**: esbuild bundles Express server
- **Static Assets**: Served from dist/public directory
- **Database**: Production PostgreSQL via Neon

### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable
- **AI Service**: Requires OPENAI_API_KEY environment variable
- **Build Scripts**: Separate development and production commands
- **Asset Management**: Vite handles static asset optimization

### Scalability Considerations
- **Database**: Serverless PostgreSQL scales automatically
- **Storage**: In-memory fallback for development/testing
- **API**: Stateless REST API design for horizontal scaling
- **Frontend**: Static assets can be CDN distributed

## Recent Changes (January 27, 2025)
- Fixed profile update API endpoint with proper schema validation and error handling
- Added Community tab to top navigation with direct routing to prevent 404 errors
- Created dedicated Profile Settings page accessible by clicking username in header
- Updated landing page to showcase social community features instead of security features
- Implemented public portfolio toggle functionality with clear visual feedback
- Fixed navigation issues by using proper wouter Link components instead of window.location
- Prevented users from liking their own portfolios with clear visual feedback
- Updated GitHub README with comprehensive documentation of all social platform features