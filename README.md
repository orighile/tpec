# TPEC Events Management Platform

A comprehensive event management platform built with React, TypeScript, and Vite.

## 🚀 Features

- **Event Management**: Create, manage, and track events
- **Guest Management**: Comprehensive guest list management with RSVP tracking
- **Vendor Marketplace**: Connect with event vendors and service providers
- **Budget Planning**: Track expenses and manage event budgets
- **TWA Support**: Trusted Web Activity for native app-like experience
- **Real-time Updates**: Live notifications and updates

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install the necessary dependencies:
```sh
npm i
```

3. Set up environment variables:
```sh
cp .env.example .env
```
Fill in your Supabase credentials and other required variables.

4. Start the development server with auto-reloading and an instant preview:
```sh
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (creates dist folder)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🏗️ CI/CD Pipeline

This project includes automated GitHub Actions workflows for seamless deployment:

### Main Workflow (`build-and-deploy.yml`)
- **Triggers**: 
  - Pushes to main/master branch
  - Version tags (v*.*.* like v1.0.0)
  - Manual workflow dispatch
- **Features**:
  - Multi-node version testing (Node 18.x, 20.x)
  - Type checking and linting
  - Production build creation (dist folder)
  - Automatic deployment to IONOS server via FTP
  - Release creation for version tags

### Development Workflow (`build-only.yml`)
- **Triggers**: Pushes to feature branches, Pull Requests
- **Features**:
  - Build verification without deployment
  - Type checking and linting
  - PR comments with build status

## 🔧 IONOS Deployment Setup

### Automatic Deployment Configuration

To set up automatic deployment to your IONOS server:

1. **Add GitHub Secrets** (Go to: Repository Settings → Secrets and variables → Actions):
   ```
   IONOS_FTP_HOST=your-ionos-ftp-host.com
   IONOS_FTP_USER=your-ftp-username  
   IONOS_FTP_PASSWORD=your-ftp-password
   ```

2. **Adjust server directory** in `.github/workflows/build-and-deploy.yml`:
   ```yaml
   server-dir: /your-web-root-path/  # Usually / or /public_html/
   ```

3. **Trigger deployment**:
   - **Automatic**: Push to main/master branch
   - **Version Release**: Create a tag: `git tag v1.0.0 && git push origin v1.0.0`
   - **Manual**: Use "Run workflow" button in GitHub Actions tab

### What happens during deployment:
1. ✅ Code is checked out from your repository
2. ✅ Node.js environment is set up
3. ✅ Dependencies are installed
4. ✅ TypeScript compilation and linting
5. ✅ Production build is created (dist folder)
6. ✅ Files are deployed to your IONOS server via FTP
7. ✅ Success/failure notifications

### Benefits:
- 🚫 **No PC required** for deployments
- ⚡ **Automatic builds** on every major commit
- 🔄 **Consistent deployment process**
- 📊 **Build status tracking**
- 🏷️ **Version releases** with automatic tagging

## 📱 TWA (Trusted Web Activity) Support

This app is configured as a TWA for native Android app experience:

- **Manifest**: `public/twa-manifest.json`
- **Asset Links**: `public/.well-known/assetlinks.json`
- **Install Prompt**: Custom TWA install component

## What technologies are used for this project?

This project is built with modern web technologies:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service
- **TanStack Query** - Data fetching and caching

## How can I deploy this project?

### Option 1: Lovable Deployment (Easiest)
Simply open [Lovable](https://lovable.dev/projects/de254497-e444-4207-922f-e36a367f9291) and click on Share → Publish.

### Option 2: Automatic IONOS Deployment (Recommended)
This project is configured with GitHub Actions for automatic deployment:

1. **Connect to GitHub** (if not already done)
2. **Set up IONOS secrets** in GitHub repository settings
3. **Push to main branch** - deployment happens automatically
4. **Check GitHub Actions tab** for deployment status

### Option 3: Manual Deployment
```sh
# Build the project locally
npm run build

# Upload the dist/ folder to your server
# The dist folder contains all the files needed for production
```

## 🔒 Environment Variables

Create a `.env` file with these variables:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_URL=your-app-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`  
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request (this will trigger build checks automatically)

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using the IONOS deployment setup above or other hosting services like Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## 🆘 Support & Links

- **Lovable Project**: https://lovable.dev/projects/de254497-e444-4207-922f-e36a367f9291
- **Documentation**: https://docs.lovable.dev/
- **GitHub Actions**: Check the Actions tab for deployment status

---

**Built with ❤️ using Lovable**
