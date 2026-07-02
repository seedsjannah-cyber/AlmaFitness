# Email Notification Setup Guide

This guide covers setting up automated email notifications for booking confirmations, order receipts, and newsletter subscriptions.

## Table of Contents
- [Email Service Providers](#email-service-providers)
- [SendGrid Integration](#sendgrid-integration)
- [Mailgun Integration](#mailgun-integration)
- [NodeMailer (SMTP)](#nodemailer-smtp)
- [Email Templates](#email-templates)
- [Best Practices](#best-practices)

---

## Email Service Providers

### Recommended Services

1. **SendGrid** (Recommended)
   - Free tier: 100 emails/day
   - Easy API integration
   - Great deliverability

2. **Mailgun**
   - Free tier: 5,000 emails/month
   - Simple REST API
   - Good for transactional emails

3. **Amazon SES**
   - Very cost-effective
   - Requires AWS account
   - 62,000 emails/month free (if hosted on EC2)

4. **Resend**
   - Modern, developer-friendly
   - Free tier: 100 emails/day
   - Beautiful email templates

---

## SendGrid Integration

### 1. Setup SendGrid Account

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Verify your sender email/domain
3. Create an API key

### 2. Install SendGrid SDK

```bash
npm install @sendgrid/mail
```

### 3. Create Email Service

Create `server/emailService.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Booking Confirmation Email
async function sendBookingConfirmation(booking) {
    const msg = {
        to: booking.email,
        from: 'hello@almasfitness.com', // Must be verified in SendGrid
        subject: 'Booking Confirmation - Alma\'s Fitness',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Booking Confirmed!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${booking.name},</p>
                        <p>Your coaching session has been successfully booked. I'm excited to work with you!</p>

                        <div class="details">
                            <h3>Session Details</h3>
                            <p><strong>Type:</strong> ${booking.coachingType}</p>
                            <p><strong>Date:</strong> ${booking.date}</p>
                            <p><strong>Time:</strong> ${booking.time}</p>
                            <p><strong>Duration:</strong> 60 minutes</p>
                        </div>

                        <p><strong>What's Next?</strong></p>
                        <ul>
                            <li>You'll receive a calendar invite with video call link</li>
                            <li>Please complete the pre-session questionnaire (link coming soon)</li>
                            <li>Feel free to reach out if you have any questions</li>
                        </ul>

                        <p style="margin-top: 30px;">
                            <a href="https://almasfitness.com/my-bookings" class="button">View My Bookings</a>
                        </p>

                        <p><em>Note: You can cancel or reschedule up to 24 hours before your session.</em></p>
                    </div>
                    <div class="footer">
                        <p>Alma's Fitness<br>
                        Email: hello@almasfitness.com | Phone: (234) 567-890</p>
                        <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('Booking confirmation sent to:', booking.email);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}

// Order Confirmation Email
async function sendOrderConfirmation(order) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px;">${item.name}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
    `).join('');

    const msg = {
        to: order.email,
        from: 'hello@almasfitness.com',
        subject: `Order Confirmation #${order.orderId} - Alma's Fitness`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    table { width: 100%; border-collapse: collapse; background: white; }
                    th { background: #f3f4f6; padding: 10px; text-align: left; }
                    .total { font-size: 18px; font-weight: bold; color: #10b981; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You for Your Order!</h1>
                        <p>Order #${order.orderId}</p>
                    </div>
                    <div class="content">
                        <p>Hi ${order.name},</p>
                        <p>Your order has been confirmed and will be shipped within 2-3 business days.</p>

                        <h3>Order Summary</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style="text-align: center;">Quantity</th>
                                    <th style="text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                <tr style="border-top: 2px solid #10b981;">
                                    <td colspan="2" style="padding: 15px; text-align: right;"><strong>Total:</strong></td>
                                    <td style="padding: 15px; text-align: right;" class="total">$${order.total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p style="margin-top: 30px;">
                            <strong>Shipping Address:</strong><br>
                            ${order.shippingAddress}
                        </p>

                        <p>You can track your order at: <a href="https://almasfitness.com/track/${order.orderId}">Track Order</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Error sending order confirmation:', error);
        return { success: false, error };
    }
}

// Newsletter Subscription
async function sendNewsletterWelcome(email) {
    const msg = {
        to: email,
        from: 'hello@almasfitness.com',
        subject: 'Welcome to Alma\'s Fitness Community!',
        html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #10b981;">Welcome to the Alma's Fitness Community!</h1>
                    <p>Thank you for subscribing to our newsletter.</p>
                    <p>You'll receive:</p>
                    <ul>
                        <li>Weekly workout tips and routines</li>
                        <li>Nutrition advice and healthy recipes</li>
                        <li>Mindset and motivation content</li>
                        <li>Exclusive offers and early access to new programs</li>
                    </ul>
                    <p>Let's start your transformation journey together!</p>
                    <p>- Alma</p>
                </div>
            </body>
            </html>
        `
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
    }
}

module.exports = {
    sendBookingConfirmation,
    sendOrderConfirmation,
    sendNewsletterWelcome
};
```

### 4. Use in API Endpoints

```javascript
const emailService = require('./emailService');

app.post('/api/bookings', async (req, res) => {
    const booking = req.body;

    // Save booking to database
    // ...

    // Send confirmation email
    await emailService.sendBookingConfirmation(booking);

    res.json({ success: true, booking });
});
```

---

## Mailgun Integration

### Setup

```bash
npm install mailgun-js
```

```javascript
const mailgun = require('mailgun-js');
const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

async function sendEmail(to, subject, html) {
    const data = {
        from: 'Alma\'s Fitness <hello@almasfitness.com>',
        to,
        subject,
        html
    };

    try {
        await mg.messages().send(data);
        return { success: true };
    } catch (error) {
        console.error('Mailgun error:', error);
        return { success: false, error };
    }
}
```

---

## NodeMailer (SMTP)

For using your own email server or Gmail:

```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
    }
});

async function sendEmail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: '"Alma\'s Fitness" <hello@almasfitness.com>',
            to,
            subject,
            html
        });
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}
```

---

## Email Templates

### Template Variables

Create reusable templates using a templating engine like Handlebars:

```bash
npm install handlebars
```

```javascript
const Handlebars = require('handlebars');
const fs = require('fs');

// Load template
const templateSource = fs.readFileSync('./templates/booking-confirmation.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

// Generate email HTML
const html = template({
    name: 'John Doe',
    date: 'January 15, 2024',
    time: '2:00 PM',
    coachingType: 'Wellness Coaching'
});
```

---

## Best Practices

### 1. Email Deliverability

- Verify your domain (SPF, DKIM, DMARC records)
- Use a professional email address (@yourdomain.com)
- Avoid spam trigger words
- Include unsubscribe links

### 2. Responsive Design

- Use inline CSS
- Keep width under 600px
- Test on multiple email clients

### 3. Security

- Store API keys in environment variables
- Never expose keys in client-side code
- Use HTTPS for all links

### 4. Error Handling

- Log all email failures
- Implement retry logic
- Provide fallback contact methods

### 5. Testing

- Use email testing tools (Mailtrap, Ethereal)
- Test on multiple email clients
- Check spam scores

---

## Environment Variables

Add to `.env`:

```env
# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Mailgun
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=mg.almasfitness.com

# SMTP
EMAIL_USER=hello@almasfitness.com
EMAIL_PASSWORD=your_app_password
```

---

## Quick Implementation Checklist

- [ ] Choose email service provider
- [ ] Sign up and verify domain
- [ ] Install SDK/package
- [ ] Create email templates
- [ ] Set up environment variables
- [ ] Implement sending logic
- [ ] Test with real emails
- [ ] Monitor deliverability
- [ ] Set up error logging

---

## Additional Resources

- [SendGrid Docs](https://docs.sendgrid.com/)
- [Mailgun Docs](https://documentation.mailgun.com/)
- [Email Design Best Practices](https://www.emailonacid.com/blog/article/email-development/)
- [HTML Email Templates](https://github.com/leemunroe/responsive-html-email-template)
