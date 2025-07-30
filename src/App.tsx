import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, MapPin, User, Phone, GraduationCap, Package, CheckCircle, AlertCircle, Timer } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface StudentInfo {
  name: string;
  rollNumber: string;
  branch: string;
  phone: string;
}

const menuItems: MenuItem[] = [
  { id: 'plain-dosa', name: 'Plain Dosa', price: 23, category: 'Dosa' },
  { id: 'onion-dosa', name: 'Onion Dosa', price: 23, category: 'Dosa' },
  { id: 'egg-dosa', name: 'Egg Dosa', price: 23, category: 'Dosa' },
  { id: 'masala-dosa', name: 'Masala Dosa', price: 23, category: 'Dosa' },
  { id: '2-idlys', name: '2 Idlys', price: 13, category: 'Idly' },
  { id: '4-idlys', name: '4 Idlys', price: 23, category: 'Idly' },
  { id: 'vada', name: 'Vada', price: 13, category: 'Others' },
  { id: 'mysore-bonda', name: 'Mysore Bonda', price: 13, category: 'Others' },
];

const branches = [
  'Computer Science Engineering',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
];

function App() {
  const [currentStep, setCurrentStep] = useState<'menu' | 'order' | 'payment' | 'confirmation'>('menu');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    rollNumber: '',
    branch: '',
    phone: '',
  });
  const [pickupSpot, setPickupSpot] = useState<'A' | 'B'>('A');
  const [isOrderingClosed, setIsOrderingClosed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Check if ordering is closed (after 7:10 AM)
  useEffect(() => {
    const checkOrderingTime = () => {
      const now = new Date();
      const cutoffTime = new Date();
      cutoffTime.setHours(7, 10, 0, 0);
      
      if (now > cutoffTime) {
        setIsOrderingClosed(true);
        setTimeRemaining('Ordering closed for today');
      } else {
        const timeDiff = cutoffTime.getTime() - now.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m remaining to order`);
      }
    };

    checkOrderingTime();
    const interval = setInterval(checkOrderingTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(orderItem => orderItem.id === item.id);
      if (existing) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(prev => prev.filter(item => item.id !== id));
    } else {
      setOrderItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleStudentInfoChange = (field: keyof StudentInfo, value: string) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }));
    
    // Auto-assign pickup spot based on branch
    if (field === 'branch') {
      if (value.includes('Computer Science') || value.includes('Information Technology')) {
        setPickupSpot('A');
      } else {
        setPickupSpot('B');
      }
    }
  };

  const isFormValid = () => {
    return studentInfo.name && studentInfo.rollNumber && studentInfo.branch && studentInfo.phone && orderItems.length > 0;
  };

  const handlePayment = () => {
    // In a real implementation, this would integrate with Razorpay
    // For now, we'll simulate the payment process
    setTimeout(() => {
      setCurrentStep('confirmation');
    }, 2000);
  };

  const MenuDisplay = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Namburu College Tiffin Service
        </h1>
        <p className="text-lg text-gray-600 mb-4">Fresh, hot breakfast delivered to your canteen</p>
        
        {/* Time remaining indicator */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          isOrderingClosed 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          <Timer size={16} />
          {timeRemaining}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="text-blue-600" size={20} />
            <span className="font-semibold text-blue-900">Pickup Time: Big Break (8:50 - 9:20 AM)</span>
          </div>
          <p className="text-blue-700 text-sm">Order cutoff: 7:10 AM daily</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {['Dosa', 'Idly', 'Others'].map(category => (
          <div key={category} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              {category}
            </h3>
            {menuItems.filter(item => item.category === category).map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
                </div>
                <button
                  onClick={() => addToOrder(item)}
                  disabled={isOrderingClosed}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isOrderingClosed
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Order</h3>
          {orderItems.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-orange-600 w-16 text-right">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total: ₹{getTotalAmount()}</span>
              <button
                onClick={() => setCurrentStep('order')}
                disabled={isOrderingClosed}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isOrderingClosed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Proceed to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const OrderForm = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => handleStudentInfoChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap size={16} className="inline mr-2" />
              Roll Number
            </label>
            <input
              type="text"
              value={studentInfo.rollNumber}
              onChange={(e) => handleStudentInfoChange('rollNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your roll number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <select
              value={studentInfo.branch}
              onChange={(e) => handleStudentInfoChange('branch', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select your branch</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={studentInfo.phone}
              onChange={(e) => handleStudentInfoChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Pickup Spot */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-blue-600" size={20} />
            <span className="font-semibold text-blue-900">Pickup Location</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPickupSpot('A')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                pickupSpot === 'A'
                  ? 'border-blue-500 bg-blue-100 text-blue-900'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              Canteen A
            </button>
            <button
              onClick={() => setPickupSpot('B')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                pickupSpot === 'B'
                  ? 'border-blue-500 bg-blue-100 text-blue-900'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              Canteen B
            </button>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Pickup Time: <strong>Big Break (8:50 - 9:20 AM)</strong>
          </p>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          {orderItems.map(item => (
            <div key={item.id} className="flex justify-between py-1">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-orange-600">₹{getTotalAmount()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('menu')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep('payment')}
            disabled={!isFormValid()}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              isFormValid()
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentSection = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
        
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-orange-900 mb-2">Order Summary</h3>
          <p className="text-orange-800">Student: {studentInfo.name}</p>
          <p className="text-orange-800">Pickup: Canteen {pickupSpot}</p>
          <p className="text-orange-800">Time: Big Break (8:50 - 9:20 AM)</p>
          <div className="mt-3 pt-3 border-t border-orange-200">
            <p className="text-xl font-bold text-orange-900">Total: ₹{getTotalAmount()}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-yellow-600" size={20} />
            <span className="font-semibold text-yellow-800">Payment Integration Required</span>
          </div>
          <p className="text-yellow-700 text-sm">
            To complete the payment integration, you'll need to set up your Razorpay account and add your API keys.
            Visit the setup guide for detailed instructions.
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors"
        >
          Pay ₹{getTotalAmount()} with Razorpay
        </button>

        <button
          onClick={() => setCurrentStep('order')}
          className="w-full mt-3 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Order
        </button>
      </div>
    </div>
  );

  const ConfirmationSection = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        
        <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-bold text-green-900 mb-3">Order Details</h3>
          <div className="space-y-2 text-green-800">
            <p><strong>Student:</strong> {studentInfo.name}</p>
            <p><strong>Roll Number:</strong> {studentInfo.rollNumber}</p>
            <p><strong>Branch:</strong> {studentInfo.branch}</p>
            <p><strong>Phone:</strong> {studentInfo.phone}</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-green-200">
            <h4 className="font-bold text-green-900 mb-2">Items Ordered</h4>
            {orderItems.map(item => (
              <div key={item.id} className="flex justify-between text-green-800">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-green-200 pt-2 mt-2 flex justify-between font-bold">
              <span>Total Paid</span>
              <span>₹{getTotalAmount()}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="text-blue-600" size={20} />
            <span className="font-bold text-blue-900">Pickup Instructions</span>
          </div>
          <p className="text-blue-800"><strong>Location:</strong> Canteen {pickupSpot}</p>
          <p className="text-blue-800"><strong>Time:</strong> Big Break (8:50 - 9:20 AM)</p>
          <p className="text-blue-700 text-sm mt-2">Please show this confirmation to collect your order</p>
        </div>

        <button
          onClick={() => {
            setCurrentStep('menu');
            setOrderItems([]);
            setStudentInfo({ name: '', rollNumber: '', branch: '', phone: '' });
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Place Another Order
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {currentStep === 'menu' && <MenuDisplay />}
      {currentStep === 'order' && <OrderForm />}
      {currentStep === 'payment' && <PaymentSection />}
      {currentStep === 'confirmation' && <ConfirmationSection />}
    </div>
  );
}

export default App;