# Quick Start Guide

Get Alma's Fitness website up and running in 5 minutes!

## ✅ Step 1: Check What You Have

Your project folder contains:
```
Alma's-Fitness/
├── index.html              ← Main website file
├── css/                    ← Styles
├── js/                     ← JavaScript functionality
├── images/                 ← Add your images here
└── README.md              ← Full documentation
```

## ✅ Step 2: Open the Website

**Option A: Double-click** `index.html` (simplest)

**Option B: Use a local server** (recommended)

Using Python:
```bash
cd "Alma's-Fitness"
python -m http.server 8000
```

Then open: **http://localhost:8000**

Using VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## ✅ Step 3: Add Your Images

The website needs these images in the `images/` folder:

**Essential:**
- `hero-bg.jpg` (hero background)
- `alma-portrait.jpg` (your photo)

**Nice to have:**
- 3 testimonial photos
- 12 product images

See `images/README.md` for specifications.

**Don't have images yet?** The website still works! Use placeholders temporarily.

## ✅ Step 4: Customize Content

### Update Contact Info
Edit `index.html` and find/replace:
- `hello@almasfitness.com` → your email
- `+1 (234) 567-890` → your phone

### Update Social Media Links
Find these in `index.html`:
```html
<a href="https://instagram.com" target="_blank">
```
Replace with your actual URLs.

### Modify Products
Edit `js/products.js` - change names, prices, descriptions.

## ✅ Step 5: Test Everything

Click through:
- [x] Book a Session form
- [x] Add products to cart
- [x] Shopping cart modal
- [x] Contact form
- [x] Newsletter signup
- [x] Mobile menu (resize browser)

## 🚀 Ready to Deploy?

### Easy Deployment (No Backend Yet)

**Netlify (Recommended):**
1. Create account at netlify.com
2. Drag & drop your `Alma's-Fitness` folder
3. Done! Get a free URL

**Vercel:**
```bash
npm install -g vercel
cd "Alma's-Fitness"
vercel
```

**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Enable
3. Select branch

## 🔧 Need Backend Features?

For payment processing and email notifications:

1. **Read the guides:**
   - `PAYMENT_INTEGRATION.md` - Stripe/PayPal setup
   - `EMAIL_SETUP.md` - Email notifications

2. **Setup backend server:**
   ```bash
   npm install express cors dotenv stripe @sendgrid/mail
   cp .env.example .env
   # Edit .env with your API keys
   node server-example.js
   ```

## 📱 What Works Right Now (No Backend)

✅ **Fully Functional:**
- Responsive design
- All animations
- Product browsing
- Shopping cart (saves to browser)
- Booking form (shows confirmation)
- Contact form (frontend validation)
- Newsletter form
- FAQ accordion
- Mobile menu

⚠️ **Needs Backend:**
- Actual payment processing
- Email notifications
- Database storage

## 🎨 Customization Tips

### Change Colors
Edit `css/style.css`:
```css
:root {
    --primary-color: #10b981;  /* Your brand color */
}
```

### Change Fonts
Edit `index.html` (in `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont" rel="stylesheet">
```

### Add/Remove Sections
Sections are clearly marked in `index.html`:
```html
<!-- Hero Section -->
<!-- About Section -->
<!-- Services Section -->
```

## 📚 Full Documentation

- **README.md** - Complete guide
- **PAYMENT_INTEGRATION.md** - Payment setup
- **EMAIL_SETUP.md** - Email setup
- **CMS_SETUP.md** - Content management
- **IMAGE_REQUIREMENTS.md** - Image specs

## ❓ Troubleshooting

**Images not showing?**
- Check file names match exactly
- Make sure images are in correct folders
- Try using browser DevTools to check paths

**Cart not saving?**
- Check if localStorage is enabled in browser
- Clear cache and reload

**Forms not working?**
- They show success messages but don't send yet
- Need backend setup for actual sending

**Styling looks off?**
- Make sure CSS files are linked correctly
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 🎉 You're All Set!

The website is ready to use. Customize it, add your images, and deploy!

Need help? Check the full README.md for detailed instructions.

---

**Next Steps:**
1. Add your images
2. Customize content
3. Test on mobile devices
4. Deploy to hosting
5. Setup backend (optional, for payments/emails)
6. Launch! 🚀
