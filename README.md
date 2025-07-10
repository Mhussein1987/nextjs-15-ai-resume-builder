# AI Resume Builder

A modern, AI-powered resume builder built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🤖 AI-powered content generation for resumes
- 📱 Responsive design for mobile and desktop
- 🌍 Multi-language support (English & Arabic)
- 🎨 Multiple resume templates
- 💾 Auto-save functionality
- 📄 PDF export capabilities
- 🔒 User authentication with Clerk
- 💳 Subscription management with Stripe

## Print/PDF Export

The application supports exporting resumes as PDFs through the browser's print functionality:

### How to Export as PDF:

1. **Using the Print Button**: Click the print button (📄 icon) in the resume editor controls
2. **Using Browser Print**: Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. **In the Print Dialog**:
   - Select "Save as PDF" as the destination
   - Choose "A4" paper size
   - Set margins to "None" or "Minimum"
   - Enable "Background graphics" for best quality
   - Click "Save" to download your resume

### Troubleshooting Empty Prints:

If your resume prints empty, try these solutions:

1. **Ensure Resume Has Content**: Make sure you've filled in at least some basic information (name, job title, etc.)
2. **Check Browser Settings**: Ensure "Background graphics" is enabled in your browser's print settings
3. **Use the Export PDF Button**: If print doesn't work, use the Export PDF button which triggers the browser's print dialog
4. **Test with Debug Page**: Visit `/debug-pdf` to test the print functionality with sample data

### Print CSS Optimizations:

The application includes comprehensive print CSS that:
- Hides all UI elements except the resume content
- Ensures proper A4 page formatting
- Maintains colors and styling
- Optimizes text rendering for different templates
- Supports both English and Arabic layouts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Clerk account for authentication
- Stripe account for payments (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-15-ai-resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Payments (Stripe) - Optional
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (OpenAI)
OPENAI_API_KEY="sk-..."
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
