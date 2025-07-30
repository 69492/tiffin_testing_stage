# Razorpay Payment Integration Guide

## Setup Instructions

### 1. Create Razorpay Account
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Complete the registration process
3. Verify your business details

### 2. Get API Keys
1. Go to Settings → API Keys in your Razorpay Dashboard
2. Generate new API Key pair
3. Note down the Key ID (public) and Key Secret (private)

### 3. Integration Code

Add this to your `index.html` in the `<head>` section:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Replace the `handlePayment` function in `App.tsx`:

```typescript
const handlePayment = () => {
  const options = {
    key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay Key ID
    amount: getTotalAmount() * 100, // Amount in paise (multiply by 100)
    currency: 'INR',
    name: 'Namburu College Tiffin Service',
    description: `Tiffin order for ${studentInfo.name}`,
    image: '/logo.png', // Optional: Add your college logo
    order_id: '', // Optional: Create order ID on backend
    handler: function (response: any) {
      // Payment successful
      console.log('Payment successful:', response);
      
      // Store order details
      const orderDetails = {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        studentInfo,
        orderItems,
        pickupSpot,
        totalAmount: getTotalAmount(),
        orderTime: new Date().toISOString(),
      };
      
      // You can store this in localStorage or send to your backend
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      
      setCurrentStep('confirmation');
    },
    prefill: {
      name: studentInfo.name,
      email: `${studentInfo.rollNumber}@namburu.edu`, // Construct email
      contact: studentInfo.phone
    },
    notes: {
      student_name: studentInfo.name,
      roll_number: studentInfo.rollNumber,
      branch: studentInfo.branch,
      pickup_spot: `Canteen ${pickupSpot}`,
      items: orderItems.map(item => `${item.name} x${item.quantity}`).join(', ')
    },
    theme: {
      color: '#F97316' // Orange theme color
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed');
        // Handle payment cancellation if needed
      }
    }
  };
  
  const rzp = new (window as any).Razorpay(options);
  rzp.on('payment.failed', function (response: any) {
    console.error('Payment failed:', response.error);
    alert('Payment failed: ' + response.error.description);
  });
  
  rzp.open();
};
```

### 4. Environment Variables (Optional)

For better security, use environment variables:

Create a `.env` file:
```
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

Then use in your code:
```typescript
key: import.meta.env.VITE_RAZORPAY_KEY_ID,
```

### 5. Order Tracking

Export payment data from Razorpay Dashboard:

1. Go to Payments → All Payments
2. Use filters to select date range
3. Export to CSV/Excel
4. The notes field will contain all order details for easy sorting by pickup location

### 6. Testing

Use these test card details:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number

### 7. Going Live

1. Complete KYC verification in Razorpay Dashboard
2. Replace test keys with live keys (rzp_live_)
3. Test thoroughly before going live

## Order Data Structure

Each successful payment will include these details in the notes:
- Student name and roll number
- Branch and pickup location
- Complete item list with quantities
- Payment timestamp

This makes it easy to organize orders by pickup location and prepare accordingly.