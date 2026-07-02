# Image Requirements Guide

This document outlines all the images needed for Alma's Fitness website, including recommended dimensions and file formats.

## Quick Reference

| Location | Quantity | Dimensions | Format |
|----------|----------|------------|--------|
| Hero Background | 1 | 1920x1080px | JPG |
| About Portrait | 1 | 800x1000px | JPG |
| Testimonials | 3 | 400x400px | JPG |
| Products | 12 | 800x800px | JPG |

## Detailed Requirements

### 1. Hero Section

**hero-bg.jpg**
- **Location**: `images/hero-bg.jpg`
- **Dimensions**: 1920x1080px (or larger, 16:9 ratio)
- **Format**: JPG (optimized, <500KB)
- **Content**: Inspiring fitness/wellness image
- **Suggestions**:
  - Person in workout pose
  - Yoga or meditation scene
  - Outdoor fitness activity
  - Motivational landscape with fitness element
- **Style**: High-quality, professional, bright, motivating
- **Notes**: This is the first image users see, make it count!

**Free Stock Photo Sources**:
- [Unsplash](https://unsplash.com/s/photos/fitness)
- [Pexels](https://www.pexels.com/search/wellness/)
- [Pixabay](https://pixabay.com/images/search/fitness/)

---

### 2. About Section

**alma-portrait.jpg**
- **Location**: `images/alma-portrait.jpg`
- **Dimensions**: 800x1000px (portrait orientation, 4:5 ratio)
- **Format**: JPG (optimized, <300KB)
- **Content**: Professional portrait of Alma
- **Suggestions**:
  - Smiling, approachable expression
  - Fitness/athletic attire or professional clothing
  - Clean background (neutral or fitness environment)
  - Natural lighting
- **Style**: Professional but warm and inviting
- **Notes**: This builds trust and connection with visitors

**Photography Tips**:
- Natural lighting or soft studio lighting
- Eye-level camera angle
- Slight smile, confident posture
- Neutral or brand-colored background

---

### 3. Testimonials Section

**testimonial-1.jpg, testimonial-2.jpg, testimonial-3.jpg**
- **Location**: `images/testimonial-1.jpg`, etc.
- **Dimensions**: 400x400px (square, 1:1 ratio)
- **Format**: JPG (optimized, <100KB each)
- **Content**: Client photos (with permission) or stock photos
- **Style**: Circular crop, friendly faces
- **Notes**: If using stock photos, choose diverse, authentic-looking people

**Options if no client photos**:
1. Use stock photos of diverse fitness enthusiasts
2. Use illustrated avatars/icons
3. Use generic profile placeholders
4. Ask clients for permission to use their photos

---

### 4. Shop - Product Images

You need **12 product images** total:

#### Apparel Products (6 images)

1. **leggings.jpg**
   - Performance leggings on model or flat lay
   - 800x800px

2. **sports-bra.jpg**
   - High-support sports bra
   - 800x800px

3. **tank-top.jpg**
   - Training tank top
   - 800x800px

4. **yoga-mat.jpg**
   - Premium yoga mat (rolled or flat)
   - 800x800px

5. **resistance-bands.jpg**
   - Resistance band set
   - 800x800px

6. **gym-bag.jpg**
   - Gym duffel bag
   - 800x800px

#### Supplement Products (6 images)

7. **protein-powder.jpg**
   - Plant-based protein container
   - 800x800px

8. **pre-workout.jpg**
   - Pre-workout supplement bottle
   - 800x800px

9. **bcaa.jpg**
   - BCAA supplement container
   - 800x800px

10. **fish-oil.jpg**
    - Omega-3 fish oil bottle
    - 800x800px

11. **multivitamin.jpg**
    - Multivitamin bottle
    - 800x800px

12. **collagen.jpg**
    - Collagen peptides container
    - 800x800px

**Product Image Guidelines**:
- **Dimensions**: 800x800px (square)
- **Format**: JPG (optimized, <200KB each)
- **Background**: White or light gray preferred
- **Style**: Clean, professional product photography
- **Consistency**: All products should have similar lighting/style

**Product Image Sources**:
- Your own products (if selling)
- Supplier/manufacturer product images
- Stock photos:
  - [Unsplash](https://unsplash.com/s/photos/fitness-products)
  - [Pexels](https://www.pexels.com/search/supplements/)
- AI-generated product images (Midjourney, DALL-E)

---

### 5. Placeholder Image

**placeholder-product.jpg** (Optional)
- **Location**: `images/placeholder-product.jpg`
- **Dimensions**: 800x800px
- **Content**: Generic "image not available" graphic
- **Notes**: Used as fallback if product images fail to load

---

## Image Organization

Organize your images folder like this:

```
images/
├── hero-bg.jpg                # Hero section background
├── alma-portrait.jpg          # About section
├── testimonial-1.jpg          # Testimonials
├── testimonial-2.jpg
├── testimonial-3.jpg
├── placeholder-product.jpg    # Fallback image
└── products/                  # Product images
    ├── leggings.jpg
    ├── sports-bra.jpg
    ├── tank-top.jpg
    ├── yoga-mat.jpg
    ├── resistance-bands.jpg
    ├── gym-bag.jpg
    ├── protein-powder.jpg
    ├── pre-workout.jpg
    ├── bcaa.jpg
    ├── fish-oil.jpg
    ├── multivitamin.jpg
    └── collagen.jpg
```

---

## Image Optimization

### Why Optimize?
- Faster page load times
- Better SEO rankings
- Improved user experience
- Reduced bandwidth costs

### Tools for Optimization

1. **Online Tools**:
   - [TinyPNG](https://tinypng.com/) - Easy drag & drop
   - [Squoosh](https://squoosh.app/) - Google's image optimizer
   - [Optimizilla](https://imagecompressor.com/)

2. **Desktop Apps**:
   - [ImageOptim](https://imageoptim.com/) (Mac)
   - [RIOT](https://riot-optimizer.com/) (Windows)

3. **Command Line**:
   ```bash
   # Install ImageMagick
   brew install imagemagick  # Mac

   # Resize and compress
   convert input.jpg -resize 800x800 -quality 85 output.jpg
   ```

### Optimization Guidelines

- **JPG**: Use for photos, quality 80-85%
- **PNG**: Use for graphics with transparency
- **WebP**: Modern format, smaller file sizes (use with JPG fallback)

---

## Creating Placeholder Images

If you don't have images yet, you can create placeholders:

### Method 1: Placeholder Services

Use temporary placeholder URLs:

```html
<img src="https://via.placeholder.com/1920x1080" alt="Hero">
<img src="https://via.placeholder.com/800x1000" alt="Portrait">
<img src="https://via.placeholder.com/800x800" alt="Product">
```

### Method 2: Unsplash Random Images

```html
<img src="https://source.unsplash.com/1920x1080/?fitness" alt="Hero">
<img src="https://source.unsplash.com/800x800/?supplements" alt="Product">
```

### Method 3: AI-Generated Images

Use AI tools to generate custom images:
- [Midjourney](https://www.midjourney.com/)
- [DALL-E](https://openai.com/dall-e-2)
- [Stable Diffusion](https://stablediffusionweb.com/)

**Example Prompts**:
- "Professional fitness coach portrait, studio lighting, inspirational"
- "Premium protein powder product photography, white background"
- "Yoga mat on wooden floor, natural lighting, minimalist"

---

## Image Naming Conventions

Use consistent, descriptive file names:

### Good Examples:
- `hero-bg.jpg`
- `alma-portrait.jpg`
- `testimonial-sarah-m.jpg`
- `product-protein-vanilla.jpg`

### Bad Examples:
- `IMG_1234.jpg`
- `photo.jpg`
- `untitled.jpg`

---

## Responsive Images (Advanced)

For better performance on mobile devices, create multiple sizes:

```
images/
├── hero-bg-large.jpg     # 1920x1080px (desktop)
├── hero-bg-medium.jpg    # 1200x675px (tablet)
└── hero-bg-small.jpg     # 768x432px (mobile)
```

Then use in HTML:

```html
<picture>
    <source media="(min-width: 1200px)" srcset="images/hero-bg-large.jpg">
    <source media="(min-width: 768px)" srcset="images/hero-bg-medium.jpg">
    <img src="images/hero-bg-small.jpg" alt="Hero">
</picture>
```

---

## Brand Photography Guidelines

When creating custom images:

### Style
- Clean, modern, minimalist
- Bright, natural lighting
- Emerald green/teal accents (brand colors)
- Professional yet approachable

### Mood
- Motivating and inspiring
- Authentic and relatable
- Empowering and positive
- Professional and trustworthy

### Subjects
- Real people (diverse ages, bodies, ethnicities)
- Natural expressions and poses
- Active and engaged
- Professional fitness settings

---

## Image Checklist

Before launching:

- [ ] Hero background (1920x1080px)
- [ ] About portrait (800x1000px)
- [ ] 3 testimonial photos (400x400px each)
- [ ] 6 apparel product images (800x800px each)
- [ ] 6 supplement product images (800x800px each)
- [ ] All images optimized (<500KB for hero, <200KB for products)
- [ ] All images have descriptive alt text
- [ ] Images are in correct folders
- [ ] Image names match code references
- [ ] Images tested on different devices
- [ ] Backup copies stored safely

---

## Copyright and Licensing

### Important Legal Notes

1. **Own Photos**: You own full rights, free to use
2. **Stock Photos**: Check license (commercial use allowed?)
3. **Client Photos**: Get written permission
4. **Photographer**: Ensure you have usage rights
5. **AI-Generated**: Check platform's terms of service

### Recommended Licenses
- **Free**: Unsplash, Pexels (CC0 or similar)
- **Paid**: Shutterstock, Adobe Stock (commercial license)

---

## Quick Start: Temporary Images

To get started immediately, use these temporary solutions:

1. **Download from Unsplash**:
   - Hero: [Fitness Hero Images](https://unsplash.com/s/photos/fitness-hero)
   - Portrait: [Professional Portrait](https://unsplash.com/s/photos/fitness-coach)
   - Products: [Fitness Products](https://unsplash.com/s/photos/fitness-products)

2. **Use placeholders** until you get real images

3. **Replace gradually** with your own professional photos

---

## Resources

- [Unsplash](https://unsplash.com/) - Free stock photos
- [Pexels](https://www.pexels.com/) - Free stock photos
- [TinyPNG](https://tinypng.com/) - Image compression
- [Canva](https://www.canva.com/) - Create custom graphics
- [Remove.bg](https://www.remove.bg/) - Remove backgrounds
- [Photopea](https://www.photopea.com/) - Free online photo editor

---

**Need Help?** If you're unsure about any image requirements, feel free to reach out!
