# Dime LUXURE Florals - E-commerce Website

A luxury e-commerce website for **Dime LUXURE Florals**, a Toronto-based company specializing in bespoke floral arrangements. Built with React, Tailwind CSS, and Stripe payment integration.

![Dime LUXURE Florals](./src/assets/logo.png)

## About Dime LUXURE Florals

Based in Toronto, Dime LUXURE Florals specializes in creating bespoke floral arrangements that embody elegance and sophistication. Each design is meticulously crafted using the finest premium blooms, ensuring every arrangement tells a unique story.

## Features

- **Luxury Product Catalog**: Browse through curated collections of premium floral arrangements
- **Shopping Cart**: Add, remove, and update product quantities in real-time
- **Responsive Design**: Fully responsive layout optimized for all devices
- **Elegant UI**: Black and gold luxury branding with smooth animations
- **Stripe Integration**: Ready for Stripe Checkout integration (requires backend setup)
- **Collections**:
  - Signature Collection
  - Seasonal Collection
  - Premium Collection
  - Luxury Box Collection

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Payment**: Stripe.js (frontend SDK)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- A Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/dime-luxure-florals.git
cd dime-luxure-florals
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Stripe Integration Setup

This demo includes the frontend Stripe integration. To enable actual payment processing, you need to set up a backend server.

### Step 1: Get Your Stripe Keys

1. Sign up for a [Stripe account](https://stripe.com)
2. Go to the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Copy your **Publishable Key** and **Secret Key** (use test keys for development)

### Step 2: Create a Backend Server

You need a backend server to create Stripe Checkout Sessions securely. Here's an example using Node.js/Express:

#### Backend Setup (Node.js/Express)

1. Create a new directory for your backend:
```bash
mkdir dime-luxure-backend
cd dime-luxure-backend
npm init -y
```

2. Install required packages:
```bash
npm install express stripe cors dotenv
```

3. Create a `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
PORT=3001
```

4. Create `server.js`:
```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'cad', // Canadian dollars for Toronto business
        product_data: {
          name: item.name,
          description: item.description,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['CA'], // Canada only for local Toronto delivery
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

5. Start the backend server:
```bash
node server.js
```

### Step 3: Update Frontend to Use Backend

Update the `handleCheckout` function in `src/App.jsx`:

```javascript
const handleCheckout = async () => {
  try {
    // Call your backend to create a Checkout Session
    const response = await fetch('http://localhost:3001/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cart,
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await loadStripe('pk_test_your_publishable_key_here');
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Failed to redirect to checkout. Please try again.');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('An error occurred during checkout. Please try again.');
  }
};
```

### Step 4: Environment Variables

Create a `.env` file in the project root:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:3001
```

Then update your code to use environment variables:

```javascript
const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

## Project Structure

```
dime-luxure-florals/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images (logo, floral arrangements)
│   ├── components/
│   │   └── ui/         # shadcn/ui components
│   ├── App.jsx         # Main application component
│   ├── App.css         # Global styles with luxury theme
│   ├── main.jsx        # Application entry point
│   └── index.css       # Base styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
└── README.md          # This file
```

## Customization

### Adding Products

Edit the `products` array in `src/App.jsx`:

```javascript
const products = [
  {
    id: 1,
    name: 'Your Arrangement Name',
    price: 299.99,
    description: 'Arrangement description',
    image: yourImage,
    category: 'Collection Name'
  },
  // Add more products...
]
```

### Styling

The app uses a custom luxury black and gold theme. Modify `src/App.css` to customize:

- `--primary`: Gold accent color
- `--secondary`: Black/dark colors
- `.luxury-gradient`: Black gradient background
- `.gold-text`: Gold gradient text effect

### Components

All UI components are from shadcn/ui and can be found in `src/components/ui/`. Customize them as needed for your brand.

## Deployment

### Deploy Frontend to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy Frontend to Netlify

1. Build the project:
```bash
pnpm run build
```

2. Deploy the `dist` folder to Netlify

### Deploy Backend

Deploy your backend server to:
- **Heroku**: Easy Node.js deployment
- **Railway**: Modern hosting platform
- **Render**: Free tier available
- **AWS Lambda**: Serverless option
- **DigitalOcean**: VPS hosting

**Important**: Update the `VITE_API_URL` environment variable after deploying your backend.

## Security Considerations

- **Never expose your Stripe Secret Key** in the frontend code
- Always create Checkout Sessions on the backend
- Validate all data on the server side
- Use HTTPS in production
- Implement proper error handling
- Add rate limiting to your API endpoints
- Verify webhook signatures for payment confirmations
- Store sensitive keys in environment variables

## Testing Stripe Integration

Use Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Contact Information

**Dime LUXURE Florals**
- Location: Toronto, Ontario
- Phone: (416) 555-LUXE
- Email: hello@dimeluxure.com
- Website: www.dimeluxure.com

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)

## License

MIT License - feel free to use this for your own projects!

## Support

For issues or questions:
- Check the [Stripe API Documentation](https://stripe.com/docs/api)
- Visit [Stack Overflow](https://stackoverflow.com/questions/tagged/stripe-payments)
- Open an issue in this repository

---

**Built with ❤️ for Dime LUXURE Florals**

*Transforming moments into unforgettable memories through luxury floral artistry*

