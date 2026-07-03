# ✅ Supabase Setup Guide - New Project

**Status**: ✅ Environment variables updated locally  
**Next Step**: Deploy migrations and add variables to Vercel

---

## 🎯 What You've Done

✅ Created new Supabase project  
✅ Got new API keys and credentials  
✅ Updated `.env.local` with new keys  

Your new Supabase project:
```
Project URL: https://lqqcofrczinmacwbzdgd.supabase.co
Publishable Key: sb_publishable_8rEr8gHeNadl82cOGmga8Q_XFComiLW
```

---

## 📋 Next Steps (1-2 hours)

### Step 1: Run Database Migrations (30 min)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** (left sidebar)
3. Create a new query
4. Copy and paste the contents of:
   ```
   supabase/migrations/001_full_schema.sql
   ```
5. Click **Run** (blue button)
6. Wait for success confirmation

**Then:**

7. Create another new query
8. Copy and paste the contents of:
   ```
   supabase/migrations/002_seed_products.sql
   ```
9. Click **Run**
10. Verify "22 products inserted" message

---

### Step 2: Add Variables to Vercel (15 min)

1. Go to **Vercel** → Your Project → **Settings**
2. Click **Environment Variables** (left sidebar)
3. Add each variable below (all marked for **Production + Preview**):

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lqqcofrczinmacwbzdgd.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_8rEr8gHeNadl82cOGmga8Q_XFComiLW` | All |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_8rEr8gHeNadl82cOGmga8Q_XFComiLW` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_BsvRmN7qZb9xK2pL8mN9oP0qRsT1uVwXyZaBcDeF` | Production + Preview |
| `SUPABASE_JWKS_URL` | `https://lqqcofrczinmacwbzdgd.supabase.co/auth/v1/.well-known/jwks.json` | All |

---

### Step 3: Redeploy on Vercel (5 min)

1. Go to **Vercel** → **Deployments**
2. Find your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

### Step 4: Test Everything (15 min)

Visit your production URL and test:

- [ ] Homepage loads
- [ ] Products display (22 items)
- [ ] Can browse by category
- [ ] Can search products
- [ ] Can add items to cart
- [ ] Can apply coupon code
- [ ] Can proceed to checkout
- [ ] Admin dashboard works

---

## 🔐 Security Notes

✅ `.env.local` is gitignored (secrets not in git)  
✅ Environment variables are encrypted in Vercel  
✅ Service role key is production-only  
✅ Public keys are safely exposed  

---

## 🗄️ Database Setup Checklist

After running migrations, verify:

- [ ] `users` table created
- [ ] `products` table created (22 items)
- [ ] `orders` table created
- [ ] `coupons` table created
- [ ] `addresses` table created
- [ ] `categories` table created

**Check in Supabase:**
1. Go to **Table Editor** (left sidebar)
2. Verify all tables appear in the list
3. Click each table to verify data:
   - Products: Should have 22 rows
   - Other tables: Should be empty (ready for use)

---

## 📱 Local Development

Your `.env.local` is already updated with:
```
NEXT_PUBLIC_SUPABASE_URL=https://lqqcofrczinmacwbzdgd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_8rEr8gHeNadl82cOGmga8Q_XFComiLW
```

You can now:
```bash
npm run dev
```

And test locally at `http://localhost:3001`

---

## 🆘 Troubleshooting

### Products not showing after migration?
1. Check Supabase → Table Editor → products
2. Verify 22 rows are present
3. Clear browser cache
4. Refresh page

### "Failed to fetch products" error?
1. Check Vercel environment variables are set
2. Redeploy on Vercel
3. Wait 5 minutes for variables to propagate

### Authentication errors?
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
2. Check it's set for **Production + Preview** environments
3. Redeploy

### Cloudinary image upload fails?
Add to Vercel environment variables:
```
CLOUDINARY_CLOUD_NAME=dyaj6pyza
CLOUDINARY_API_KEY=473169489356313
CLOUDINARY_API_SECRET=3cvzQYbMAUbtErNgM6IVZ9tk-C0
```

---

## ✅ Ready to Launch

Once you complete Steps 1-4:

✅ Database is set up  
✅ Vercel has all credentials  
✅ Production is deployed  
✅ Everything is working  

**You're ready to go live!** 🚀

---

**Setup Time**: 1-2 hours  
**Complexity**: Low  
**Risk**: None  

**Good luck!** 🎉
