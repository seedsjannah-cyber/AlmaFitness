# Payment Integration Guide

This guide will help you integrate Stripe and PayPal payment gateways into Alma's Fitness website.

## Table of Contents
- [Stripe Integration](#stripe-integration)
- [PayPal Integration](#paypal-integration)
- [Testing](#testing)
- [Security Best Practices](#security-best-practices)

---

## Stripe Integration

### 1. Setup Stripe Account

1. Sign up at [https://stripe.com](https://stripe.com)
2. Complete business verification
3. Get your API keys from the Dashboard

### 2. Install Stripe SDK

Add Stripe.js to your website:

```html
<!-- Add to index.html before closing </body> tag -->
<script src="https://js.stripe.com/v3/"></script>
```

### 3. Create Backend API Endpoint

You'll need a server-side endpoint to create payment intents. Here's an example using Node.js:

```javascript
// server.js (Node.js/Express example)
const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY');
const app = express();

app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency || 'usd',
            metadata: {
                orderId: req.body.orderId
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 4. Update Frontend Code

Modify `js/cart.js` to integrate Stripe:

```javascript
// Add at the top of cart.js
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');

async function processStripePayment() {
    const total = getCartTotal();

    try {
        // Create payment intent on your server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: total,
                currency: 'usd',
                orderId: Date.now()
            })
        });

        const { clientSecret } = await response.json();

        // Redirect to Stripe Checkout
        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Customer Name'
                }
            }
        });

        if (error) {
            showNotification(error.message, 'error');
        } else {
            // Payment successful
            handleSuccessfulPayment();
        }
    } catch (error) {
        showNotification('Payment failed. Please try again.', 'error');
    }
}
```

### 5. Alternative: Stripe Checkout (Easier)

For a simpler integration, use Stripe Checkout:

```javascript
async function processStripePayment() {
    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cart,
            successUrl: window.location.origin + '/success',
            cancelUrl: window.location.origin + '/cart'
        })
    });

    const { sessionId } = await response.json();

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
        showNotification(error.message, 'error');
    }
}
```

Backend for Checkout Session:

```javascript
app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image]
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        })),
        mode: 'payment',
        success_url: req.body.successUrl,
        cancel_url: req.body.cancelUrl
    });

    res.json({ sessionId: session.id });
});
```

---

## PayPal Integration

### 1. Setup PayPal Account

1. Sign up at [https://developer.paypal.com](https://developer.paypal.com)
2. Create a REST API app
3. Get your Client ID and Secret

### 2. Add PayPal SDK

```html
<!-- Add to index.html before closing </body> tag -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

### 3. Update Frontend Code

Modify `js/cart.js`:

```javascript
function setupPayPalButton() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: getCartTotal().toFixed(2)
                    },
                    description: 'Alma\'s Fitness Purchase'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                handleSuccessfulPayment(details);
            });
        },
        onError: function(err) {
            showNotification('Payment failed. Please try again.', 'error');
        }
    }).render('#paypal-button-container');
}
```

### 4. Create PayPal Button Container

Update the checkout modal in `cart.js` to include:

```html
<div id="paypal-button-container"></div>
```

---

## Testing

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Authentication: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
```

### PayPal Sandbox

1. Create test accounts at [https://developer.paypal.com/developer/accounts](https://developer.paypal.com/developer/accounts)
2. Use sandbox credentials for testing
3. Switch to live credentials for production

---

## Security Best Practices

### 1. Never Expose Secret Keys
- Keep API secret keys on the server only
- Use environment variables
- Never commit keys to version control

### 2. Use HTTPS
- Always use SSL/TLS in production
- Stripe and PayPal require HTTPS

### 3. Validate on Server
- Always verify payments on your backend
- Don't trust client-side data

### 4. PCI Compliance
- Using Stripe.js or PayPal SDK keeps you PCI compliant
- Never handle raw card data on your server

### 5. Webhook Verification
- Verify webhook signatures
- Use webhooks to handle payment confirmations

Example Stripe webhook:

```javascript
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            // Fulfill the order
            fulfillOrder(paymentIntent.metadata.orderId);
        }

        res.json({received: true});
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
```

---

## Environment Variables

Create a `.env` file (never commit this):

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret

# Other
NODE_ENV=development
PORT=3000
```

---

## Recommended Implementation

For the easiest and most secure implementation:

1. **For one-time payments (Shop)**: Use Stripe Checkout or PayPal Smart Buttons
2. **For subscriptions (Coaching)**: Use Stripe Billing or PayPal Subscriptions
3. **For flexibility**: Offer both payment methods

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Developer Docs](https://developer.paypal.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [PayPal Sandbox](https://developer.paypal.com/developer/accounts)
