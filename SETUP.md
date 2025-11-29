# PurrTech Setup Guide

## 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

## 2. Setup Database

### Option A: Supabase (Recommended)
1. Create a Supabase project at https://supabase.com
2. Run the SQL script in `scripts/001-init-database.sql`
3. Get your URL and keys from Project Settings

### Option B: Neon
1. Create a Neon project at https://neon.tech
2. Run the SQL script in the SQL editor
3. Get your connection string

## 3. Configure Environment Variables

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your actual values:
- Supabase URL and keys
- Stripe keys (if using payments)
- IoT device secret

## 4. Setup Stripe (Optional, for payments)

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Add to `.env.local`

## 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## 6. IoT Device Integration

### Device Configuration

The litter box device sends data to `/api/litter-visits` with:

\`\`\`json
{
  "catId": "cat-id-from-pairing",
  "duration": 240,
  "weight": 4.2,
  "deviceToken": "secret-device-token"
}
\`\`\`

### Device Token Generation

1. Pair device in app
2. Get unique token to authenticate device
3. Store in device firmware

## 7. Deploy to Vercel

\`\`\`bash
vercel
\`\`\`

## Database Queries

### Get user's cats with recent visits
\`\`\`sql
SELECT cats.*, COUNT(litter_visits.id) as visit_count
FROM cats
LEFT JOIN litter_visits ON cats.id = litter_visits.cat_id
WHERE cats.user_id = 'user-id'
GROUP BY cats.id
ORDER BY cats.created_at DESC;
\`\`\`

### Get anomalies from the past week
\`\`\`sql
SELECT * FROM litter_visits
WHERE anomaly_detected = true
AND visit_timestamp > NOW() - INTERVAL '7 days'
ORDER BY visit_timestamp DESC;
\`\`\`

## Support

For issues or questions, visit our support page or email support@purrtech.com
