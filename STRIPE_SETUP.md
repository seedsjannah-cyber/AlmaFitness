# Stripe Payment Setup Guide

This guide will help you set up Stripe payments for your Alma's Fitness website.

## Quick Setup (5 Minutes)

### Step 1: Create a Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with your email
3. Complete the account setup

### Step 2: Get Your Publishable Key

1. After logging in, go to: https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Keep this handy for Step 3

### Step 3: Update Your Website

1. Open `js/booking.js` in your code editor
2. Find this line (around line 3):
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE';
   ```
3. Replace `pk_test_YOUR_KEY_HERE` with your actual publishable key:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Abc...xyz'; // Your actual key
   ```
4. Save the file

### Step 4: Set Up Stripe Checkout (Backend Required)

For production use, you'll need a backend server to create Stripe Checkout sessions.

**Option A: Simple Backend with Vercel Functions**

Create `api/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingData, amount, currency = 'usd' } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: bookingData.coachingTypeLabel,
            description: `Session on ${bookingData.date} at ${bookingData.time}`,
          },
          unit_amount: amount, // Amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/#book`,
      customer_email: bookingData.email,
      metadata: {
        bookingId: bookingData.bookingId || Date.now().toString(),
        name: bookingData.name,
        phone: bookingData.phone,
        date: bookingData.date,
        time: bookingData.time,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Option B: Use Stripe Payment Links (Easiest - No Code!)**

1. Go to: https://dashboard.stripe.com/payment-links
2. Click "New payment link"
3. Create a payment link for each service:
   - Diet Plan: $97
   - Workout Plan: $97
   - 1-on-1 Training: $197/session
   - Life Coaching: $147/session
   - Combined: $247/month
4. Copy the payment link URLs
5. Update the booking flow to redirect to the appropriate payment link

### Step 5: Environment Variables (for backend)

Add to your `.env` file:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Never commit your secret key to GitHub!**

### Step 6: Deploy

1. Push your changes to GitHub
2. If using Vercel, add the environment variables in your Vercel dashboard:
   - Go to: Project Settings → Environment Variables
   - Add `STRIPE_SECRET_KEY`

## Testing

### Test Card Numbers

Use these in test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

**Card Details:**
- Any future expiry date
- Any 3-digit CVC
- Any 5-digit ZIP code

## Going Live

1. Complete your Stripe account verification
2. Replace test keys with live keys:
   - `pk_live_...` (publishable)
   - `sk_live_...` (secret)
3. Test thoroughly before going live
4. Enable Stripe webhooks for payment confirmations

## Webhook Setup (Recommended)

1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Save the webhook secret and add to your environment variables

## Alternative: Payment Links (No Backend)

If you don't want to set up a backend:

1. Create Stripe Payment Links for each service
2. Update `js/booking.js` to use payment links:

```javascript
const PAYMENT_LINKS = {
  'wellness-diet': 'https://buy.stripe.com/test_xxx',
  'wellness-workout': 'https://buy.stripe.com/test_yyy',
  'wellness-training': 'https://buy.stripe.com/test_zzz',
  'life-coaching': 'https://buy.stripe.com/test_aaa',
  'combined': 'https://buy.stripe.com/test_bbb',
};

async function processPayment(formData) {
  const paymentLink = PAYMENT_LINKS[formData.coachingType];
  window.location.href = paymentLink;
}
```

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Vercel Functions: https://vercel.com/docs/functions

## Current Pricing

- Wellness Coaching - Diet Plan: $97/month
- Wellness Coaching - Workout Plan: $97/month
- Wellness Coaching - 1-on-1 Training: $197/session
- Life Coaching: $147/session
- Combined Package: $247/month

You can modify these prices in `index.html` by editing the `data-price` attributes.
