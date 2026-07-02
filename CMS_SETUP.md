# CMS Integration Guide

This guide covers integrating a Content Management System (CMS) to easily manage services, products, testimonials, and other content without touching code.

## Table of Contents
- [Recommended CMS Options](#recommended-cms-options)
- [Sanity CMS Integration](#sanity-cms-integration)
- [Strapi Integration](#strapi-integration)
- [WordPress Headless CMS](#wordpress-headless-cms)
- [Static CMS (Netlify CMS)](#static-cms-netlify-cms)
- [Content Structure](#content-structure)

---

## Recommended CMS Options

### 1. **Sanity CMS** (Recommended)
- **Pros**: Real-time updates, great DX, generous free tier
- **Best for**: Modern JAMstack sites
- **Difficulty**: Easy

### 2. **Strapi**
- **Pros**: Self-hosted, full control, open-source
- **Best for**: Custom requirements
- **Difficulty**: Moderate

### 3. **WordPress (Headless)**
- **Pros**: Familiar interface, huge ecosystem
- **Best for**: Non-technical users
- **Difficulty**: Easy

### 4. **Contentful**
- **Pros**: Enterprise-grade, great API
- **Best for**: Scaling businesses
- **Difficulty**: Moderate

---

## Sanity CMS Integration

### 1. Setup Sanity Project

```bash
npm install -g @sanity/cli
sanity init
```

Follow prompts to create your project.

### 2. Define Schema

Create `schemas/product.js`:

```javascript
export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Product Name',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96
            }
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    {title: 'Apparel', value: 'apparel'},
                    {title: 'Supplements', value: 'supplements'}
                ]
            }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule => Rule.required().positive()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text'
        },
        {
            name: 'image',
            title: 'Product Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'inStock',
            title: 'In Stock',
            type: 'boolean',
            initialValue: true
        }
    ]
}
```

Create `schemas/service.js`:

```javascript
export default {
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Service Title',
            type: 'string'
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    {title: 'Wellness Coaching', value: 'wellness'},
                    {title: 'Life & Mindset Coaching', value: 'life'}
                ]
            }
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text'
        },
        {
            name: 'icon',
            title: 'FontAwesome Icon Class',
            type: 'string',
            description: 'e.g., fas fa-dumbbell'
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number'
        }
    ]
}
```

Create `schemas/testimonial.js`:

```javascript
export default {
    name: 'testimonial',
    title: 'Testimonial',
    type: 'document',
    fields: [
        {
            name: 'clientName',
            title: 'Client Name',
            type: 'string'
        },
        {
            name: 'clientTitle',
            title: 'Client Title/Profession',
            type: 'string'
        },
        {
            name: 'content',
            title: 'Testimonial Content',
            type: 'text'
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: Rule => Rule.min(1).max(5)
        },
        {
            name: 'image',
            title: 'Client Photo',
            type: 'image'
        },
        {
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false
        }
    ]
}
```

### 3. Register Schemas

Update `schemas/schema.js`:

```javascript
import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import product from './product';
import service from './service';
import testimonial from './testimonial';

export default createSchema({
    name: 'default',
    types: schemaTypes.concat([
        product,
        service,
        testimonial
    ])
});
```

### 4. Fetch Data in Frontend

Install Sanity client:

```bash
npm install @sanity/client
```

Create `js/sanity-client.js`:

```javascript
import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true
});

// Fetch products
export async function getProducts() {
    const query = '*[_type == "product"] | order(_createdAt desc)';
    const products = await client.fetch(query);

    return products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: urlFor(product.image).width(400).url(),
        inStock: product.inStock
    }));
}

// Fetch services
export async function getServices() {
    const query = '*[_type == "service"] | order(order asc)';
    return await client.fetch(query);
}

// Fetch testimonials
export async function getTestimonials() {
    const query = '*[_type == "testimonial" && featured == true]';
    return await client.fetch(query);
}

// Helper for image URLs
import imageUrlBuilder from '@sanity/image-url';
const builder = imageUrlBuilder(client);
function urlFor(source) {
    return builder.image(source);
}
```

### 5. Update Frontend to Use CMS Data

Modify `js/products.js`:

```javascript
import { getProducts } from './sanity-client.js';

async function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');

    if (!productsGrid) return;

    // Fetch from CMS instead of hardcoded data
    const allProducts = await getProducts();

    const filteredProducts = filter === 'all'
        ? allProducts
        : allProducts.filter(product => product.category === filter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                ${product.inStock ? `
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                ` : `
                    <button class="add-to-cart-btn" disabled>Out of Stock</button>
                `}
            </div>
        </div>
    `).join('');
}
```

---

## Strapi Integration

### 1. Setup Strapi

```bash
npx create-strapi-app@latest my-project --quickstart
```

### 2. Create Content Types

Navigate to Content-Type Builder in Strapi admin and create:

**Product**:
- name (Text)
- slug (UID based on name)
- category (Enumeration: apparel, supplements)
- price (Number, Decimal)
- description (Rich Text)
- image (Media)
- inStock (Boolean)

**Service**:
- title (Text)
- category (Enumeration: wellness, life)
- description (Rich Text)
- icon (Text)
- order (Number)

**Testimonial**:
- clientName (Text)
- clientTitle (Text)
- content (Rich Text)
- rating (Number)
- image (Media)
- featured (Boolean)

### 3. Fetch Data

```javascript
const STRAPI_URL = 'http://localhost:1337';

async function getProducts() {
    const response = await fetch(`${STRAPI_URL}/api/products?populate=*`);
    const data = await response.json();

    return data.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        category: item.attributes.category,
        price: item.attributes.price,
        description: item.attributes.description,
        image: `${STRAPI_URL}${item.attributes.image.data.attributes.url}`,
        inStock: item.attributes.inStock
    }));
}
```

---

## WordPress Headless CMS

### 1. Setup WordPress

1. Install WordPress
2. Install WPGraphQL plugin
3. Configure permalinks and enable REST API

### 2. Create Custom Post Types

Add to `functions.php`:

```php
function create_product_post_type() {
    register_post_type('product',
        array(
            'labels' => array(
                'name' => __('Products'),
                'singular_name' => __('Product')
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
        )
    );
}
add_action('init', 'create_product_post_type');
```

### 3. Fetch Data

```javascript
const WP_URL = 'https://your-wordpress-site.com';

async function getProducts() {
    const response = await fetch(`${WP_URL}/wp-json/wp/v2/product?_embed`);
    const products = await response.json();

    return products.map(product => ({
        id: product.id,
        name: product.title.rendered,
        description: product.content.rendered,
        image: product._embedded['wp:featuredmedia'][0].source_url,
        price: product.acf.price, // Using Advanced Custom Fields
        category: product.acf.category
    }));
}
```

---

## Static CMS (Netlify CMS)

Perfect for static sites hosted on Netlify, GitHub Pages, etc.

### 1. Setup

Create `admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "products"
    label: "Products"
    folder: "content/products"
    create: true
    fields:
      - {label: "Name", name: "name", widget: "string"}
      - {label: "Category", name: "category", widget: "select", options: ["apparel", "supplements"]}
      - {label: "Price", name: "price", widget: "number"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "In Stock", name: "inStock", widget: "boolean", default: true}

  - name: "testimonials"
    label: "Testimonials"
    folder: "content/testimonials"
    create: true
    fields:
      - {label: "Client Name", name: "name", widget: "string"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Content", name: "content", widget: "text"}
      - {label: "Rating", name: "rating", widget: "number", min: 1, max: 5}
      - {label: "Photo", name: "image", widget: "image"}
```

Create `admin/index.html`:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
</body>
</html>
```

---

## Content Structure

### Recommended Data Models

**Products**:
- ID
- Name
- Slug
- Category
- Price
- Description
- Images (multiple)
- Stock Status
- SKU
- Sizes (if applicable)
- Colors (if applicable)

**Services**:
- ID
- Title
- Category
- Description
- Icon
- Price/Pricing Structure
- Duration
- Display Order

**Testimonials**:
- ID
- Client Name
- Client Title/Role
- Content
- Rating
- Photo
- Date
- Featured Flag

**Bookings**:
- ID
- Client Info
- Service Type
- Date & Time
- Status
- Notes
- Created At

**Blog Posts** (optional):
- Title
- Slug
- Content
- Author
- Date
- Category
- Featured Image
- SEO Metadata

---

## Best Practices

1. **Use a Staging Environment**: Test changes before pushing to production
2. **Implement Caching**: Cache CMS data to improve performance
3. **Validate Data**: Always validate and sanitize data from CMS
4. **Version Control**: Keep schema/config files in git
5. **Regular Backups**: Backup CMS data regularly
6. **Image Optimization**: Use CDN and optimize images
7. **Access Control**: Set proper user roles and permissions

---

## Quick Start Recommendation

For Alma's Fitness, I recommend **Sanity CMS** because:
- Real-time updates
- Great free tier
- Easy to integrate
- Excellent image handling
- Modern developer experience
- Can be used with any hosting

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Strapi Documentation](https://docs.strapi.io/)
- [WPGraphQL](https://www.wpgraphql.com/)
- [Netlify CMS](https://www.netlifycms.org/)
