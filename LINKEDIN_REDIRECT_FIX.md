# LinkedIn App Configuration Guide

## Current Issue: Redirect URI Mismatch

The error "The redirect_uri does not match the registered value" means your LinkedIn app configuration doesn't include the redirect URI we're using in the code.

## Possible Solutions:

### 1. Update Your LinkedIn App Settings

Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) and:

1. **Find your app** (Client ID: `86jsp1par7ms4u`)
2. **Go to Auth tab**
3. **Under "Authorized redirect URLs for your app"**, add these URLs:
   - `http://localhost:4200/`
   - `http://localhost:4200/auth/linkedin/callback`
   - `http://127.0.0.1:4200/`
   - `https://localhost:4200/` (if using HTTPS)

### 2. Common Redirect URI Patterns

Try these redirect URI options in your LinkedIn app:

- ✅ `http://localhost:4200/`
- ✅ `http://localhost:4200/auth/linkedin/callback`
- ✅ `http://127.0.0.1:4200/`
- ✅ `http://localhost:4200/callback`

### 3. Check Current LinkedIn App Settings

To see what redirect URIs are currently configured:

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Select your app
3. Go to "Auth" tab
4. Look at "Authorized redirect URLs for your app"
5. Copy the exact URL(s) listed there

### 4. Update Our Code to Match

If you want to use a specific redirect URI that's already configured in your LinkedIn app, let me know what it is and I'll update the code to match.

## Testing Steps:

1. **Update LinkedIn app settings** with the redirect URI
2. **Wait 5-10 minutes** for LinkedIn to propagate the changes
3. **Clear browser cache** and cookies for LinkedIn
4. **Try the authentication again**

## Alternative Testing Approach:

If you want to test without modifying LinkedIn app settings, you can:

1. **Use a different redirect URI** that's already configured
2. **Use a production domain** instead of localhost
3. **Set up ngrok** to create a public tunnel to localhost

Let me know what redirect URIs are configured in your LinkedIn app, and I'll update the code accordingly!
