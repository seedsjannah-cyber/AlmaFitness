/**
 * Example Backend Server for Alma's Fitness
 *
 * This is a simple Express.js server that handles:
 * - Payment processing (Stripe)
 * - Email notifications (SendGrid)
 * - Booking management
 * - Contact form submissions
 *
 * To use this server:
 * 1. Install dependencies: npm install express cors dotenv stripe @sendgrid/mail
 * 2. Create .env file with your API keys (see .env.example)
 * 3. Run: node server-example.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// ===================================
// Stripe Setup
// ===================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ===================================
// SendGrid Setup
// ===================================
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===================================
// In-Memory Storage (Use Database in Production)
// ===================================
const bookings = [];
const orders = [];

// ===================================
// API Routes
// ===================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// ===================================
// Booking Endpoints
// ===================================

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'confirmed'
        };

        // Save booking (in production, save to database)
        bookings.push(booking);

        // Send confirmation email
        await sendBookingConfirmationEmail(booking);

        res.json({
            success: true,
            booking: booking,
            message: 'Booking confirmed successfully'
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
});

// Get All Bookings (Admin)
app.get('/api/bookings', (req, res) => {
    res.json({ bookings });
});

// Get Booking by ID
app.get('/api/bookings/:id', (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (booking) {
        res.json({ booking });
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
});

// ===================================
// Payment Endpoints
// ===================================

// Create Payment Intent (Stripe)
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata: metadata || {}
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create Checkout Session (Stripe Checkout)
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, successUrl, cancelUrl } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.description,
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            })),
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook for Stripe Events
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment successful:', paymentIntent.id);
                // Fulfill the order
                fulfillOrder(paymentIntent.metadata);
                break;

            case 'payment_intent.payment_failed':
                console.log('Payment failed');
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// ===================================
// Contact Form Endpoint
// ===================================

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Send email notification
        await sgMail.send({
            to: process.env.FROM_EMAIL,
            from: process.env.FROM_EMAIL,
            subject: `Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        // Send confirmation to user
        await sgMail.send({
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Thanks for contacting Alma\'s Fitness',
            html: `
                <p>Hi ${name},</p>
                <p>Thank you for reaching out. We've received your message and will get back to you soon.</p>
                <p>Best regards,<br>Alma's Fitness Team</p>
            `
        });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===================================
// Newsletter Endpoint
// ===================================

app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;

        // In production, save to database and/or email marketing service
        // (Mailchimp, SendGrid Marketing, etc.)

        // Send welcome email
        await sgMail.send({
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Welcome to Alma\'s Fitness Community!',
            html: `
                <h1>Welcome!</h1>
                <p>Thank you for subscribing to our newsletter.</p>
                <p>You'll receive weekly tips on fitness, nutrition, and mindset.</p>
                <p>Let's transform together!</p>
                <p>- Alma</p>
            `
        });

        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===================================
// Helper Functions
// ===================================

async function sendBookingConfirmationEmail(booking) {
    const msg = {
        to: booking.email,
        from: process.env.FROM_EMAIL,
        subject: 'Booking Confirmation - Alma\'s Fitness',
        html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0;">Booking Confirmed!</h1>
                    </div>
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p>Hi ${booking.name},</p>
                        <p>Your coaching session has been successfully booked!</p>

                        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
                            <h3 style="margin-top: 0; color: #10b981;">Session Details</h3>
                            <p><strong>Type:</strong> ${booking.coachingType}</p>
                            <p><strong>Date:</strong> ${booking.date}</p>
                            <p><strong>Time:</strong> ${booking.time}</p>
                            <p><strong>Duration:</strong> 60 minutes</p>
                        </div>

                        <p>Looking forward to working with you!</p>
                        <p style="margin-top: 30px;">
                            <em>Note: You can cancel or reschedule up to 24 hours before your session.</em>
                        </p>

                        <div style="text-align: center; margin-top: 30px;">
                            <p>Best regards,<br><strong>Alma</strong></p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('Booking confirmation sent to:', booking.email);
    } catch (error) {
        console.error('Error sending booking confirmation:', error);
        throw error;
    }
}

async function fulfillOrder(metadata) {
    // In production, this would:
    // 1. Update order status in database
    // 2. Send confirmation email to customer
    // 3. Notify admin of new order
    // 4. Trigger fulfillment process
    console.log('Fulfilling order:', metadata);

    // Save order
    const order = {
        id: Date.now(),
        ...metadata,
        status: 'completed',
        completedAt: new Date().toISOString()
    };
    orders.push(order);

    // Send order confirmation email
    // await sendOrderConfirmationEmail(order);
}

// ===================================
// Error Handling
// ===================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ===================================
// Start Server
// ===================================

app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 Alma's Fitness Server is running!
    ========================================
    Port: ${PORT}
    Environment: ${process.env.NODE_ENV || 'development'}

    API Endpoints:
    - GET  /api/health
    - POST /api/bookings
    - POST /api/create-payment-intent
    - POST /api/create-checkout-session
    - POST /api/contact
    - POST /api/newsletter

    Frontend: http://localhost:${PORT}
    ========================================
    `);
});

// ===================================
// Graceful Shutdown
// ===================================

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});
