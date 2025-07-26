# Poke Port AI: Pokemon Card Recognition and Portfolio Management App

## Overview

Poke Port AI is a full-stack web application that allows users to scan Pokemon cards using AI recognition, track their card portfolio, and view market analysis. The app combines computer vision technology with market data to help collectors manage and value their Pokemon card collections.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Image Upload**: Supports camera capture and file upload
- **AI Recognition**: OpenAI GPT-4o vision model for card identification
- **Market Integration**: Automatic price lookup after recognition
- **Real-time Preview**: Live camera feed and image preview

### Portfolio Management
- **Card Collection**: CRUD operations for user's card collection
- **Filtering**: Filter by set, condition, and other attributes
- **View Modes**: Grid and list view options
- **Statistics**: Portfolio value tracking and analytics

### Market Analysis
- **Real-time Charts**: Interactive price trends using Recharts library
- **Price History**: 6-month historical price visualization with line charts
- **Trading Volume**: Monthly trading activity with bar charts
- **Market Overview**: Market cap, daily volume, top gainers dashboard
- **Data Sources**: Pokemon TCG API, TCGPlayer, and eBay integration
- **Performance Tracking**: Top performing cards with price change indicators

### UI/UX Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Consistent design system using shadcn/ui
- **Toast Notifications**: User feedback for actions
- **Loading States**: Proper loading and error handling
- **Mobile Navigation**: Bottom navigation for mobile devices

## Data Flow

1. **Card Scanning Flow**:
   - User uploads/captures card image
   - Image converted to base64 and sent to OpenAI API
   - AI returns card recognition data
   - Market price lookup performed
   - Card saved to database with recognition results

2. **Portfolio Flow**:
   - Cards retrieved from database
   - Client-side filtering and sorting
   - Real-time updates using React Query
   - CRUD operations through REST API

3. **Market Data Flow**:
   - External API integration for pricing data
   - Cached market data in database
   - Periodic updates for price trends
   - Real-time display in UI components

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