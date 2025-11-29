# PurrTech API Documentation

## Authentication

All API endpoints require the `x-user-id` header (except auth endpoints).

\`\`\`bash
curl -H "x-user-id: user-123" https://api.purrtech.com/api/cats
\`\`\`

## Endpoints

### Auth

#### POST /api/auth/register
Create a new user account.

\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
\`\`\`

#### POST /api/auth/login
Login user.

\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Cats

#### GET /api/cats
Get all cats for the authenticated user.

#### POST /api/cats
Create a new cat profile.

\`\`\`json
{
  "name": "Michi",
  "breed": "Siamese",
  "dateOfBirth": "2021-03-15"
}
\`\`\`

### Litter Visits

#### GET /api/litter-visits?catId=xxx&days=7
Get litter visits for a specific cat.

#### POST /api/litter-visits
Record a new visit (called by IoT device).

\`\`\`json
{
  "catId": "cat-123",
  "duration": 324,
  "weight": 4.2,
  "deviceToken": "device-token-xxx"
}
\`\`\`

### Health Alerts

#### GET /api/health-alerts?catId=xxx
Get health alerts for a cat.

#### PATCH /api/health-alerts
Mark alert as read.

\`\`\`json
{
  "alertId": "alert-123"
}
\`\`\`

### Subscriptions

#### GET /api/subscriptions
Get user's current subscription.

#### POST /api/subscriptions
Create or upgrade subscription.

\`\`\`json
{
  "planId": "vip",
  "stripePaymentMethodId": "pm_xxx"
}
\`\`\`

## Error Responses

All errors follow this format:

\`\`\`json
{
  "success": false,
  "error": "Error message"
}
\`\`\`

## Rate Limiting

- Free plan: 1,000 requests/month
- VIP: 50,000 requests/month
- BLACK: Unlimited
