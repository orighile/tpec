# 🚀 IONOS Deployment Setup Guide

This guide will help you set up automatic deployment to your IONOS server using GitHub Actions.

## 📋 Prerequisites

1. **GitHub Repository**: Your project is connected to GitHub
2. **IONOS Hosting**: You have an IONOS web hosting account
3. **FTP Access**: You have FTP credentials for your IONOS server

## 🛠️ Step-by-Step Setup

### Step 1: Get Your IONOS FTP Credentials

1. Log into your IONOS account
2. Go to your hosting package
3. Find your FTP credentials:
   - **FTP Host**: Usually something like `your-domain.com` or `ftp.your-domain.com`
   - **FTP Username**: Your FTP username
   - **FTP Password**: Your FTP password

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** and add these three secrets:

   ```
   IONOS_FTP_HOST
   Value: your-ionos-ftp-host.com
   ```

   ```
   IONOS_FTP_USER  
   Value: your-ftp-username
   ```

   ```
   IONOS_FTP_PASSWORD
   Value: your-ftp-password
   ```

### Step 3: Configure Server Directory (Optional)

If your website files don't go in the root directory:

1. Open `.github/workflows/build-and-deploy.yml`
2. Find this line:
   ```yaml
   server-dir: /  # Adjust this to your IONOS web root directory
   ```
3. Change it to your web root path (commonly `/public_html/` or `/htdocs/`)

### Step 4: Test the Deployment

**Option A: Push to Main Branch**
```bash
git add .
git commit -m "Setup CI/CD deployment"
git push origin main
```

**Option B: Create a Version Release**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Option C: Manual Trigger**
1. Go to GitHub → Actions tab
2. Select "Build and Deploy to IONOS"
3. Click "Run workflow"

## 📊 Monitoring Deployments

### Check Deployment Status
1. Go to your GitHub repository
2. Click **Actions** tab
3. See the latest workflow runs

### What You'll See During Deployment:
- ✅ **Checkout code** - Downloads your latest code
- ✅ **Setup Node.js** - Installs Node.js environment  
- ✅ **Install dependencies** - Runs `npm install`
- ✅ **Type checking** - Validates TypeScript
- ✅ **Build application** - Creates the `dist/` folder
- ✅ **Deploy to IONOS** - Uploads files via FTP

### Successful Deployment
- Green checkmark ✅ in GitHub Actions
- Your website updated at your IONOS domain
- Notification: "🚀 Deployment to IONOS completed successfully!"

## 🔧 Customization Options

### Change Deployment Triggers

Edit `.github/workflows/build-and-deploy.yml`:

```yaml
on:
  push:
    branches: [ main, master ]    # Deploy on main branch pushes
    tags: [ 'v*.*.*' ]           # Deploy on version tags
  workflow_dispatch:              # Allow manual triggers
```

### Add Environment Variables

If you need environment variables for production:

```yaml
- name: Build application
  run: npm run build
  env:
    NODE_ENV: production
    VITE_API_URL: ${{ secrets.API_URL }}
    VITE_CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
```

### Deploy to Subdirectory

To deploy to a subdirectory like `/app/`:

```yaml
server-dir: /public_html/app/
```

## 🛠️ Troubleshooting

### Common Issues:

**❌ FTP Connection Failed**
- Check your IONOS FTP credentials
- Ensure the FTP host is correct
- Try connecting manually with an FTP client first

**❌ Build Failed**
- Check the GitHub Actions logs
- Usually a TypeScript or dependency issue
- Fix the error and push again

**❌ Files Not Updating**
- Check the `server-dir` path
- Clear your browser cache
- Check IONOS file permissions

**❌ Deployment Slow**
- Normal for first deployment (many files)
- Subsequent deployments are faster (only changed files)

### Getting Help:
1. Check GitHub Actions logs for detailed errors
2. Test FTP connection manually
3. Verify all secrets are set correctly

## 🎉 Success!

Once setup correctly, you'll have:
- ✅ **Automatic builds** on every main branch push
- ✅ **Zero-downtime deployments** to IONOS
- ✅ **No PC required** for deployments
- ✅ **Version tracking** with Git tags
- ✅ **Build status monitoring** in GitHub

Your development workflow is now:
1. Make changes in Lovable or locally
2. Commit & push to main branch  
3. GitHub automatically builds & deploys
4. Your IONOS site is updated! 🚀