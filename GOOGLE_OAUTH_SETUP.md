# Google OAuth Setup Guide for AniPub

This guide will help you set up Google OAuth authentication for your AniPub application.

## Prerequisites

- Google Cloud Console account
- Node.js application with the required dependencies installed

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/google/callback`
   - For production: `https://yourdomain.com/auth/google/callback`
8. Copy the Client ID and Client Secret

## Step 2: Environment Configuration

1. Copy `example.env` to `.env`
2. Add your Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID='your_actual_google_client_id'
GOOGLE_CLIENT_SECRET='your_actual_google_client_secret'
GOOGLE_CALLBACK_URL='http://localhost:3000/auth/google/callback'
SESSION_SECRET='your_random_session_secret'
```

## Step 3: Install Dependencies

The required dependencies are already installed:
- `passport`
- `passport-google-oauth20`
- `express-session`

## Step 4: Database Schema Update

The user model has been updated to support OAuth:
- `Password` field is now optional
- Added `googleId` field for OAuth users
- Added `profilePicture` field for profile images

## Step 5: Test the Integration

1. Start your application: `npm start`
2. Navigate to `/Login`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. You should be redirected to `/Home` after successful authentication

## Features

- **Seamless Integration**: Google OAuth works alongside existing email/password authentication
- **Auto-Activation**: OAuth users are automatically activated (no email verification required)
- **Profile Sync**: Automatically imports user's Google profile picture and display name
- **Session Management**: Uses JWT tokens for authentication consistency

## Security Notes

- OAuth users don't have passwords stored
- Session secrets should be strong and unique
- HTTPS is recommended for production
- Google OAuth tokens are handled securely by Passport.js

## Troubleshooting

- **"Invalid redirect URI"**: Check your Google Cloud Console redirect URI configuration
- **"Client ID not found"**: Verify your environment variables are set correctly
- **Session issues**: Ensure SESSION_SECRET is set and unique

## Production Considerations

- Update `GOOGLE_CALLBACK_URL` to your production domain
- Set `secure: true` in session configuration for HTTPS
- Use environment-specific Google OAuth credentials
- Implement proper error handling and logging
