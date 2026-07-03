# Vercel Environment Variables Setup Guide

**Status**: ⚠️ DATABASE ERROR - Environment variables not configured  
**Error**: "Failed to create product. Check Supabase env vars in Vercel."  
**Solution**: Add environment variables to Vercel project

---

## 🔧 Required Environment Variables

### Supabase Configuration

| Variable | Value | Type | From |
|----------|-------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xvpggskttpiotdgtzehm.supabase.co | String | .env.local line 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGc... (long JWT) | String | .env.local line 3 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | sb_publishable_... | String | .env.local line 4 |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGc... (long JWT) | String | .env.local line 6 |

### NextAuth Configuration

| Variable | Value | Type | From |
|----------|-------|------|------|
| `NEXTAUTH_SECRET` | I9SDGyVjHZkJiJBEZyVktFjmB1753giJGs0eWcaZkmg= | String | .env.local line 9 |
| `NEXTAUTH_URL` | https://your-vercel-domain.vercel.app | String | Your Vercel domain |

### Payment Configuration (Razorpay)

| Variable | Value | Type | From |
|----------|-------|------|------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | rzp_test_T0nVEMpbulBGEo | String | .env.local line 17 |
| `RAZORPAY_KEY_SECRET` | k8GRF5sWGu9pYETfiVOedCoc | String | .env.local line 19 |

### Image Upload (Cloudinary)

| Variable | Value | Type | From |
|----------|-------|------|------|
| `CLOUDINARY_CLOUD_NAME` | dyaj6pyza | String | .env.local line 22 |
| `CLOUDINARY_API_KEY` | 473169489356313 | String | .env.local line 23 |
| `CLOUDINARY_API_SECRET` | 3cvzQYbMAUbtErNgM6IVZ9tk-C0 | String | .env.local line 24 |

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Open Vercel Project Settings

1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your "Vani Enterprises" project
4. Click **Settings** (top menu)
5. Click **Environment Variables** (left sidebar)

### Step 2: Add Supabase URL

1. Click **Add New**
2. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://xvpggskttpiotdgtzehm.supabase.co`
4. **Environments**: Check all (Production, Preview, Development)
5. Click **Save**

### Step 3: Add Supabase Anon Key

1. Click **Add New**
2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cGdnc2t0dHBpb3RkZ3R6ZWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODExMTYsImV4cCI6MjA5NTU1NzExNn0.BRY5p7zai9oP9natAVdyW99qMVx2B3Juzf6QQniYPVU`
4. **Environments**: Check all
5. Click **Save**

### Step 4: Add Supabase Publishable Key

1. Click **Add New**
2. **Name**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. **Value**: `sb_publishable_DVy1ft5t649oK_MDVl1quA_dWV5SAXt`
4. **Environments**: Check all
5. Click **Save**

### Step 5: Add Supabase Service Role Key (CRITICAL)

⚠️ **WARNING**: This is a private key. Handle with care!

1. Click **Add New**
2. **Name**: `SUPABASE_SERVICE_ROLE_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cGdnc2t0dHBpb3RkZ3R6ZWhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk4MTExNiwiZXhwIjoyMDk1NTU3MTE2fQ.YT1umNxLQ1h2yg6R8GUcIbydhJUIGytCGBGTJRt_Xj4`
4. **Environments**: Production + Preview only (NOT Development for security)
5. Click **Save**

### Step 6: Add NextAuth Secret

1. Click **Add New**
2. **Name**: `NEXTAUTH_SECRET`
3. **Value**: `I9SDGyVjHZkJiJBEZyVktFjmB1753giJGs0eWcaZkmg=`
4. **Environments**: Check all
5. Click **Save**

### Step 7: Add NextAuth URL

1. Click **Add New**
2. **Name**: `NEXTAUTH_URL`
3. **Value**: `https://yourdomain.vercel.app` (replace with your actual Vercel domain)
4. **Environments**: Production + Preview
5. Click **Save**

### Step 8-11: Add Razorpay Keys

**Step 8**: Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Value: `rzp_test_T0nVEMpbulBGEo`

**Step 9**: Add `RAZORPAY_KEY_SECRET`
- Value: `k8GRF5sWGu9pYETfiVOedCoc`
- Environments: Production + Preview only

**Step 10**: Add Cloudinary Variables
- `CLOUDINARY_CLOUD_NAME`: `dyaj6pyza`
- `CLOUDINARY_API_KEY`: `473169489356313`
- `CLOUDINARY_API_SECRET`: `3cvzQYbMAUbtErNgM6IVZ9tk-C0` (Production + Preview only)

### Step 11: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## ✅ Verification Checklist

After setting up environment variables:

- [ ] Navigate to https://yourdomain.vercel.app
- [ ] Homepage loads without errors
- [ ] Products display on shop page
- [ ] Can add items to cart
- [ ] Can apply coupon codes
- [ ] Can checkout with payment
- [ ] Admin can create new products
- [ ] No console errors in browser

---

## 🔍 Troubleshooting

### Error: "Failed to create product"

**Cause**: `SUPABASE_SERVICE_ROLE_KEY` not set in Vercel

**Solution**:
1. Go to Vercel Environment Variables
2. Add `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy project

### Error: "Unauthorized" when creating products

**Cause**: Not logged in as admin or session invalid

**Solution**:
1. Login with admin credentials:
   - Email: `admin@vanienterprises.com`
   - Password: `Admin@1234`
2. Go to admin panel
3. Try creating product again

### Error: "Invalid Razorpay key"

**Cause**: Razorpay keys not set or incorrect

**Solution**:
1. Verify keys match your Razorpay account
2. Use test keys for development: `rzp_test_*`
3. Update environment variables
4. Redeploy

### Database connection timeout

**Cause**: Supabase URL or connection string invalid

**Solution**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check if Supabase project is active
3. Verify JWT tokens haven't expired
4. Contact Supabase support if issue persists

---

## 🔐 Security Best Practices

### ✅ DO:

- ✅ Use service role key only in production/preview
- ✅ Rotate keys if exposed
- ✅ Keep secrets in Vercel, not in git
- ✅ Use environment-specific values
- ✅ Audit access logs regularly

### ❌ DON'T:

- ❌ Commit `.env.local` to git
- ❌ Share secrets in chat/email
- ❌ Use production keys in development
- ❌ Expose secret keys in client-side code
- ❌ Store secrets in code comments

---

## 📚 Environment Variables by Context

### Client-Side (Browser visible - Start with `NEXT_PUBLIC_`)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

### Server-Side (API routes only - NO prefix)

```
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_SECRET
CLOUDINARY_API_SECRET
NEXTAUTH_SECRET
```

---

## 🚀 Environment-Specific Setup

### Development (Local)

- Use test keys (Razorpay, Supabase)
- Store in `.env.local` (NOT committed)
- Localhost URL for NextAuth

### Preview (Staging)

- Use test keys
- Vercel preview domain for NextAuth
- Same as production but on staging data

### Production

- Use production keys
- Production domain for NextAuth
- Enable all security features

---

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**: Deployments → Logs
2. **Check Browser Console**: F12 → Console
3. **Verify Supabase**: Check database, RLS policies
4. **Verify API**: Use tools like Postman or curl
5. **Contact Support**: Vercel/Supabase support teams

---

## 🔗 Helpful Links

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase API Keys](https://app.supabase.com/project/_/settings/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/getting-started/example)

---

**Last Updated**: 2026-07-03  
**Status**: Ready for Implementation  
**Priority**: HIGH - Blocks product creation
