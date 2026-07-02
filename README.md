# Alma's Fitness - Premium Wellness & Life Coaching Website

A modern, responsive website for Alma's Fitness featuring wellness coaching, life coaching services, e-commerce functionality, and online booking system.

![Alma's Fitness](images/preview.png)

## Features

### Core Features
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Modern UI/UX**: Clean, minimalist aesthetic with smooth animations
- **E-commerce**: Product catalog with shopping cart and checkout
- **Booking System**: Online session booking with calendar integration
- **Payment Processing**: Secure payments via Stripe and PayPal
- **Email Notifications**: Automated booking confirmations and order receipts
- **Newsletter**: Email subscription functionality
- **SEO Optimized**: Meta tags, semantic HTML, and performance optimizations

### Sections
1. **Hero Section**: Eye-catching hero with dual CTAs
2. **About**: Personal introduction and coaching philosophy
3. **Services**:
   - Wellness Coaching (Diet plans, Workout plans, 1-on-1 Training)
   - Life & Mindset Coaching (Goals, Habits, Confidence, Relationships, Stress Management, Resilience)
4. **Book a Session**: Interactive booking form with date/time picker
5. **Shop**: Product grid with filtering (Apparel & Supplements)
6. **Testimonials**: Client success stories
7. **FAQ**: Collapsible accordion for common questions
8. **Contact**: Contact form with social media links
9. **Newsletter**: Email signup form

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Fonts**: Google Fonts (Montserrat, Playfair Display)
- **Icons**: Font Awesome 6
- **Animations**: Custom CSS animations
- **Storage**: localStorage for cart and bookings
- **Payments**: Stripe & PayPal integration ready
- **Email**: SendGrid/Mailgun integration ready

## Color Palette

- **Primary**: Emerald Green (#10b981)
- **Accent**: Teal (#14b8a6)
- **Text**: Dark Gray (#1f2937)
- **Background**: White (#ffffff)
- **Secondary**: Black (#000000)

## Project Structure

```
Alma's-Fitness/
├── index.html                  # Main HTML file
├── css/
│   ├── style.css              # Main stylesheet
│   └── animations.css         # Animation definitions
├── js/
│   ├── main.js                # Core functionality
│   ├── products.js            # Product management
│   ├── cart.js                # Shopping cart logic
│   ├── booking.js             # Booking form handler
│   └── animations.js          # Scroll animations
├── images/
│   ├── hero-bg.jpg            # Hero background
│   ├── alma-portrait.jpg      # About section image
│   ├── testimonials/          # Testimonial images
│   └── products/              # Product images
├── PAYMENT_INTEGRATION.md     # Payment setup guide
├── EMAIL_SETUP.md             # Email notification guide
├── CMS_SETUP.md               # CMS integration guide
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Local server (optional, for development)

### Installation

1. **Clone or Download** this repository

2. **Add Images**: Place your images in the `images/` directory:
   ```
   images/
   ├── hero-bg.jpg              # 1920x1080px recommended
   ├── alma-portrait.jpg        # 800x1000px recommended
   ├── testimonial-1.jpg        # 400x400px
   ├── testimonial-2.jpg
   ├── testimonial-3.jpg
   └── products/
       ├── leggings.jpg
       ├── sports-bra.jpg
       └── ...
   ```

3. **Run Locally** (optional):

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx http-server
   ```

   Using VS Code Live Server:
   - Install Live Server extension
   - Right-click `index.html` → "Open with Live Server"

4. **Open in Browser**:
   ```
   http://localhost:8000
   ```

## Customization

### Update Contact Information

Edit `index.html`:

```html
<!-- Email -->
<a href="mailto:hello@almasfitness.com">hello@almasfitness.com</a>

<!-- Phone -->
<a href="tel:+1234567890">+1 (234) 567-890</a>

<!-- Social Media -->
<a href="https://instagram.com/yourhandle">Instagram</a>
```

### Add/Modify Products

Edit `js/products.js`:

```javascript
const products = [
    {
        id: 1,
        name: "Your Product Name",
        category: "apparel", // or "supplements"
        price: 49.99,
        image: "images/products/your-product.jpg",
        description: "Product description here"
    },
    // Add more products...
];
```

### Modify Services

Edit the services section in `index.html`:

```html
<div class="service-card">
    <div class="service-icon">
        <i class="fas fa-your-icon"></i>
    </div>
    <h4 class="service-title">Your Service Title</h4>
    <p class="service-description">Your service description</p>
</div>
```

### Change Colors

Edit `css/style.css`:

```css
:root {
    --primary-color: #10b981;      /* Change to your brand color */
    --primary-dark: #059669;
    --accent-color: #14b8a6;
    /* ... */
}
```

## Payment Integration

### Setup Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Follow instructions in `PAYMENT_INTEGRATION.md`

### Setup PayPal

1. Create account at [developer.paypal.com](https://developer.paypal.com)
2. Create REST API app
3. Follow instructions in `PAYMENT_INTEGRATION.md`

See **[PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md)** for detailed setup.

## Email Notifications

### Setup SendGrid (Recommended)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Create API key
4. Follow instructions in `EMAIL_SETUP.md`

See **[EMAIL_SETUP.md](EMAIL_SETUP.md)** for detailed setup.

## CMS Integration

To manage content without editing code, integrate a CMS:

### Recommended: Sanity CMS

1. Install Sanity CLI: `npm install -g @sanity/cli`
2. Create project: `sanity init`
3. Define schemas
4. Update frontend to fetch from Sanity

See **[CMS_SETUP.md](CMS_SETUP.md)** for detailed setup.

## Deployment

### Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy automatically on push

```bash
# One-time setup
netlify init

# Deploy
netlify deploy --prod
```

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Go to repository Settings → Pages
2. Select branch to deploy
3. Save

### Traditional Hosting (cPanel, FTP)

1. Zip the entire project
2. Upload to your hosting
3. Extract to `public_html` or `www`

## Backend Setup (Optional)

For full functionality (payments, emails), you'll need a backend server.

### Node.js/Express Backend

1. **Initialize Project**:
   ```bash
   mkdir server
   cd server
   npm init -y
   npm install express cors dotenv stripe @sendgrid/mail
   ```

2. **Create Server** (`server.js`):
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();

   app.use(cors());
   app.use(express.json());

   // Your API routes here
   // See PAYMENT_INTEGRATION.md and EMAIL_SETUP.md

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

3. **Create `.env`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   SENDGRID_API_KEY=SG....
   ```

4. **Run Server**:
   ```bash
   node server.js
   ```

### Serverless Functions (Netlify/Vercel)

For simpler deployment, use serverless functions:

**Netlify Functions** (`netlify/functions/create-payment.js`):
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const { amount } = JSON.parse(event.body);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd'
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

## SEO Optimization

### Meta Tags

Already included in `index.html`:
- Title and description
- Open Graph tags (for social sharing)
- Viewport meta tag (responsive)

### To Improve SEO:

1. **Add sitemap.xml**:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
           <loc>https://almasfitness.com/</loc>
           <priority>1.0</priority>
       </url>
   </urlset>
   ```

2. **Add robots.txt**:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://almasfitness.com/sitemap.xml
   ```

3. **Setup Google Analytics**:
   ```html
   <!-- Add before </head> -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

4. **Optimize Images**:
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Add alt text to all images

## Performance Optimization

### Current Optimizations
- Minified CSS and JS (ready for production)
- Lazy loading images
- Efficient animations
- Caching with localStorage

### Additional Improvements

1. **Minify CSS/JS**: Use build tools
   ```bash
   npm install -g minify
   minify css/style.css > css/style.min.css
   ```

2. **Enable Caching**: Add to `.htaccess`
   ```apache
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType image/jpg "access 1 year"
       ExpiresByType image/jpeg "access 1 year"
       ExpiresByType image/png "access 1 year"
       ExpiresByType text/css "access 1 month"
       ExpiresByType application/javascript "access 1 month"
   </IfModule>
   ```

3. **Use CDN**: Serve static assets from CDN

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Cart not persisting
- Check if localStorage is enabled in browser
- Clear cache and reload

### Images not loading
- Verify image paths are correct
- Check image file names match code
- Ensure images exist in `images/` directory

### Forms not submitting
- Check browser console for errors
- Verify backend API is running (if using)
- Check CORS settings

### Booking dates not working
- Ensure date input is supported (fallback for older browsers)
- Check date format validation

## Future Enhancements

Potential features to add:
- [ ] User authentication and accounts
- [ ] Order tracking system
- [ ] Blog/content section
- [ ] Video tutorials
- [ ] Member dashboard
- [ ] Live chat support
- [ ] Subscription/membership plans
- [ ] Mobile app (React Native/Flutter)
- [ ] AI-powered workout recommendations

## Support & Contribution

For issues or questions:
1. Check existing documentation
2. Review code comments
3. Search online resources
4. Create an issue on GitHub (if applicable)

## License

This project is for Alma's Fitness. All rights reserved.

## Credits

- **Design**: Custom design for Alma's Fitness
- **Fonts**: Google Fonts (Montserrat, Playfair Display)
- **Icons**: Font Awesome
- **Development**: Custom built with HTML, CSS, JavaScript

---

## Quick Start Checklist

- [ ] Add all images to `images/` directory
- [ ] Update contact information in `index.html`
- [ ] Customize colors in `css/style.css`
- [ ] Add your products in `js/products.js`
- [ ] Update social media links
- [ ] Setup payment gateway (Stripe/PayPal)
- [ ] Configure email service (SendGrid)
- [ ] Test all forms
- [ ] Test shopping cart
- [ ] Test booking system
- [ ] Optimize images
- [ ] Test on mobile devices
- [ ] Setup Google Analytics
- [ ] Deploy to hosting
- [ ] Test live site
- [ ] Submit to Google Search Console

---

**Built with for Alma's Fitness | Transform Your Body, Elevate Your Mind**
