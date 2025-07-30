# Namburu College Tiffin Ordering System

A mobile-friendly, static website that allows Namburu college students to pre-order their morning tiffins with instant payment and clear pickup instructions.

## Features

- **Interactive Menu Display**: View all available tiffin items with updated pricing
- **Smart Order Form**: Collect student details with auto-assigned pickup spots
- **Payment Integration**: Razorpay integration for secure instant payments
- **Time-based Cutoff**: Automatic ordering cutoff at 7:10 AM
- **Mobile Responsive**: Optimized for both mobile and desktop usage
- **Admin Tracking**: Easy order management through Razorpay dashboard

## Menu & Pricing

| Item | Student Price |
|------|---------------|
| Plain Dosa | ₹23 |
| Onion Dosa | ₹23 |
| Egg Dosa | ₹23 |
| Masala Dosa | ₹23 |
| 2 Idlys | ₹13 |
| 4 Idlys | ₹23 |
| Vada | ₹13 |
| Mysore Bonda | ₹13 |

## Pickup Information

- **Time**: Big Break (8:50 - 9:20 AM)
- **Locations**: Canteen A or B (auto-assigned based on branch)
- **Order Cutoff**: 7:10 AM daily

## Setup Instructions

### 1. Razorpay Integration

To enable payments, you'll need to:

1. Create a [Razorpay account](https://dashboard.razorpay.com/signup)
2. Get your API keys from the Razorpay Dashboard
3. Replace the payment simulation in the code with actual Razorpay integration

```javascript
// Add this to your HTML head
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// Replace the handlePayment function with:
const handlePayment = () => {
  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID',
    amount: getTotalAmount() * 100, // Amount in paise
    currency: 'INR',
    name: 'Namburu College Tiffin Service',
    description: 'Tiffin Order Payment',
    handler: function (response) {
      // Payment successful
      setCurrentStep('confirmation');
    },
    prefill: {
      name: studentInfo.name,
      email: `${studentInfo.rollNumber}@namburu.edu`,
      contact: studentInfo.phone
    },
    theme: {
      color: '#F97316'
    }
  };
  
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

### 2. Deployment

This is a static site that can be deployed to:

- **GitHub Pages**: Push to GitHub and enable Pages in repository settings
- **Netlify**: Connect your GitHub repository for automatic deployments
- **Vercel**: Import your GitHub repository for instant deployment

### 3. Admin Order Management

1. Log into your Razorpay Dashboard
2. Navigate to Payments section
3. Export payment data with customer details
4. Use the exported CSV to organize pickup orders by canteen location

## Order Flow

1. **Menu Selection**: Students browse and select tiffin items
2. **Student Information**: Enter personal and academic details
3. **Pickup Assignment**: Automatic assignment based on branch
4. **Payment**: Secure payment through Razorpay
5. **Confirmation**: Order confirmation with pickup details

## Time Management

- **Ordering Window**: Available until 7:10 AM
- **Preparation Time**: 7:10 AM - 8:50 AM
- **Pickup Window**: 8:50 AM - 9:20 AM (Big Break)

## Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Payment**: Razorpay
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel)

## Mobile Optimization

- Responsive design with mobile-first approach
- Touch-friendly interface elements
- Optimized loading times
- Clear typography for small screens

## Support

For technical issues or feature requests, contact the development team or create an issue in the repository.