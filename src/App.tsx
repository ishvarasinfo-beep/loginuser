import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, MapPin, Search, ChevronLeft, Plus, Minus, ArrowUp } from 'lucide-react';

type AuthStep = 'initial' | 'phone' | 'otp';
type AppStep = 'auth' | 'landing' | 'restaurant';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  category: string;
  isVeg?: boolean;
  isBestseller?: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  image: string;
  priceForTwo: number;
  categories: string[];
  menu: MenuItem[];
}

interface CartItem {
  restaurantId: string;
  item: MenuItem;
  quantity: number;
}

const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Pizzeria Roma',
    cuisine: 'Punjabi, Home Food',
    location: 'Raj Nagar',
    image: 'https://images.pexels.com/photos/1082802/pexels-photo-1082802.jpeg?auto=compress&cs=tinysrgb&w=600',
    priceForTwo: 1000,
    categories: ['Non-Veg', 'Veg', 'Egg', 'Beverage'],
    menu: [
      {
        id: 'm1',
        name: 'Bruschetta',
        description: 'Serve 1 Grilled Bread with tomatoes, garlic basil and olive oil',
        price: 450,
        offerPrice: 400,
        category: 'Appetizers',
        isVeg: true,
      },
      {
        id: 'm2',
        name: 'Garlic Bread',
        description: 'Serve 1 Grilled Bread with tomatoes, garlic basil and olive oil',
        price: 450,
        offerPrice: 400,
        category: 'Appetizers',
        isVeg: true,
        isBestseller: true,
      },
      {
        id: 'm3',
        name: 'Margherita Pizza',
        description: 'Serve 1 Grilled Bread with tomatoes, garlic basil and olive oil',
        price: 450,
        category: 'Main Course',
        isBestseller: true,
      },
      {
        id: 'm4',
        name: 'Spaghetti Carbonara',
        description: 'Serve 1 Grilled Bread with tomatoes, garlic basil and olive oil',
        price: 450,
        category: 'Main Course',
      },
    ],
  },
  {
    id: '2',
    name: 'Pizza Hut',
    cuisine: 'Italian, Fast Food',
    location: 'Raj Nagar',
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=600',
    priceForTwo: 1000,
    categories: ['Non-Veg', 'Veg'],
    menu: [],
  },
  {
    id: '3',
    name: 'Theobroma',
    cuisine: 'Desserts, Bakery',
    location: 'Raj Nagar',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600',
    priceForTwo: 800,
    categories: ['Veg', 'Desserts'],
    menu: [],
  },
  {
    id: '4',
    name: 'Burger King',
    cuisine: 'Fast Food',
    location: 'Raj Nagar',
    image: 'https://images.pexels.com/photos/2373307/pexels-photo-2373307.jpeg?auto=compress&cs=tinysrgb&w=600',
    priceForTwo: 900,
    categories: ['Non-Veg', 'Veg'],
    menu: [],
  },
];

function App() {
  const [appStep, setAppStep] = useState<AppStep>('auth');
  const [authStep, setAuthStep] = useState<AuthStep>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (authStep === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [authStep, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setAuthStep('otp');
      setTimer(30);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAppStep('landing');
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    otpInputs.current[0]?.focus();
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = (item: MenuItem) => {
    if (!selectedRestaurant) return;
    const existingItem = cart.find(c => c.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { restaurantId: selectedRestaurant.id, item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.map(c => c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c).filter(c => c.quantity > 0));
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredRestaurants = SAMPLE_RESTAURANTS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowBackToTop(target.scrollTop > 300);
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {appStep === 'auth' ? (
        <div className="min-h-screen flex flex-col">
          <header className="px-8 py-6">
            <h1 className="text-3xl font-serif text-gray-800">Feastify</h1>
          </header>

          <main className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
              {authStep === 'initial' && (
                <div className="text-center space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                      Get your food in a flash
                    </h2>
                    <p className="text-lg text-gray-600">Sign In To Get Started</p>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-3 text-lg">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-gray-500 text-sm">or</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <button
                      onClick={() => setAuthStep('phone')}
                      className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 rounded-full border border-gray-300 transition-colors text-lg"
                    >
                      Continue with Phone Number
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 pt-4">
                    By continuing, you agree to your Terms of Service and Privacy Policy
                  </p>
                </div>
              )}

              {authStep === 'phone' && (
                <div className="text-center space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                      Login or sign up
                    </h2>
                    <p className="text-lg text-gray-600">
                      We'll send you one time password to your phone number
                    </p>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-left text-gray-700 font-medium text-lg">
                        Mobile Number
                      </label>
                      <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden">
                        <div className="px-6 py-4 border-r border-gray-300 text-gray-700 font-medium">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9897865467"
                          className="flex-1 px-6 py-4 text-lg outline-none"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={phoneNumber.length !== 10}
                    >
                      Send OTP
                    </button>
                  </form>

                  <p className="text-sm text-gray-500">
                    This helps us keep your account secure
                  </p>
                </div>
              )}

              {authStep === 'otp' && (
                <div className="text-center space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                      Verify Your Mobile Number
                    </h2>
                    <p className="text-lg text-gray-600">
                      Enter the 6 digit code sent to +91 {phoneNumber}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                        />
                      ))}
                    </div>

                    <div className="text-gray-600">
                      {timer > 0 ? (
                        <p>Resend OTP in {formatTimer()}</p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors text-lg"
                    >
                      Verify & Login
                    </button>
                  </form>

                  <button
                    onClick={() => setAuthStep('phone')}
                    className="text-gray-700"
                  >
                    Entered the wrong number?{' '}
                    <span className="font-semibold text-gray-800">Change it</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      ) : selectedRestaurant ? (
        <div className="flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-200 sticky top-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <h1 className="text-2xl font-serif text-gray-800">Feastify</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{getCartCount()} items</span>
                <ShoppingCart className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="h-48 bg-gray-300 relative">
              <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover rounded-b-2xl" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="mb-8">
                <h1 className="text-4xl font-serif text-gray-800 mb-2">{selectedRestaurant.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span>{selectedRestaurant.cuisine}</span>
                  <span>{selectedRestaurant.location}</span>
                </div>
                <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4" />
                  Get Direction
                </button>
              </div>

              <div className="flex gap-2 mb-8 overflow-x-auto pb-3">
                {selectedRestaurant.categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {Array.from(new Set(selectedRestaurant.menu.map(m => m.category))).map((categoryName) => {
                const items = selectedRestaurant.menu.filter(m => m.category === categoryName);
                return (
                  <div key={categoryName} className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{categoryName} ({items.length})</h2>
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4 pb-6 border-b border-gray-200 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {item.isVeg ? (
                                <span className="text-green-600 text-xl">●</span>
                              ) : (
                                <span className="text-red-600 text-xl">●</span>
                              )}
                              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                              {item.isBestseller && (
                                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded font-medium">Bestseller</span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-4 ml-7">{item.description}</p>
                            <div className="flex items-center gap-3 ml-7">
                              <span className="text-lg font-bold text-gray-800">Rs {item.offerPrice || item.price}</span>
                              {item.offerPrice && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">Rs {item.price}</span>
                                  <span className="text-sm text-red-600 font-medium">Rs {item.price - item.offerPrice} off</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            {cart.find(c => c.item.id === item.id) ? (
                              <div className="flex items-center gap-2 bg-orange-500 rounded-lg px-2 py-2">
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-white hover:opacity-80"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold text-white w-5 text-center text-sm">
                                  {cart.find(c => c.item.id === item.id)?.quantity}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="text-white hover:opacity-80"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="px-6 py-2 bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-200 transition-colors whitespace-nowrap"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {getCartCount() > 0 && (
              <div className="fixed bottom-6 right-6">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors">
                  View Cart ({getCartCount()})
                </button>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-white">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-3xl font-serif text-gray-800">Feastify</h1>
              <div className="flex items-center gap-6">
                <button className="text-gray-700 hover:text-gray-900 font-medium">SignIn</button>
                <ShoppingCart className="w-6 h-6 text-orange-500 cursor-pointer" />
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-800 font-semibold">Ganganagar</span>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search For: your search query...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto" ref={mainScrollRef} onScroll={handleScroll}>
            <div className="h-80 bg-gradient-to-r from-gray-300 to-gray-400 relative flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-white text-6xl font-bold">FOODWALLAH</h1>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Restaurant with online food delivery in Ganga Nagar
                </h2>

                <div className="flex gap-4 flex-wrap">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 font-medium transition-colors">
                    Price Range
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 font-medium transition-colors">
                    Restaurant Type
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 font-medium transition-colors">
                    Filters
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 font-medium transition-colors">
                    Sort
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                      <p className="text-xs text-gray-500 mb-3">{restaurant.location}</p>
                      <p className="text-red-600 text-sm font-semibold">Rs. {restaurant.priceForTwo} for two</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center py-12 pb-20">
                <div className="text-gray-500 flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-orange-500 border-r-transparent rounded-full animate-spin"></div>
                  Loading More Restaurants.....
                </div>
              </div>
            </div>
          </main>

          <footer className="bg-gray-900 text-gray-300 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-4 gap-12 mb-8">
                <div>
                  <h4 className="font-bold text-white mb-4">FoodWallah</h4>
                  <p className="text-sm">© 2025 Dine Order. All Rights Reserved</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-4">Social</h4>
                  <div className="flex gap-4 text-sm">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Facebook</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
