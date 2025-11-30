import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Flower2, CreditCard, MapPin, Phone, Mail, Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx'
import { loadStripe } from '@stripe/stripe-js'
import './App.css'
import logo from './assets/logo.png'
import floral1 from './assets/floral1.jpg'
import floral2 from './assets/floral2.jpg'
import floral3 from './assets/floral3.jpg'
import floral4 from './assets/floral4.jpg'
import floral5 from './assets/floral5.webp'
import floral6 from './assets/floral6.jpg'

// Luxury floral arrangements for Dime LUXURE Florals
const products = [
  {
    id: 1,
    name: 'Hermès Elegance',
    price: 299.99,
    description: 'Luxurious arrangement featuring premium roses and peonies in signature designer style',
    image: floral1,
    category: 'Signature Collection'
  },
  {
    id: 2,
    name: 'Chanel Noir',
    price: 349.99,
    description: 'Sophisticated arrangement with roses and orchids in an elegant designer-inspired presentation',
    image: floral2,
    category: 'Signature Collection'
  },
  {
    id: 3,
    name: 'Garden Romance',
    price: 249.99,
    description: 'Romantic blend of garden roses, ranunculus, and seasonal blooms',
    image: floral3,
    category: 'Seasonal Collection'
  },
  {
    id: 4,
    name: 'Opulent Blooms',
    price: 399.99,
    description: 'Premium designer arrangement with exotic flowers and lush greenery',
    image: floral4,
    category: 'Premium Collection'
  },
  {
    id: 5,
    name: 'Peach Perfection',
    price: 279.99,
    description: 'Delicate peach roses, peonies, and orchids in a luxury flower box',
    image: floral5,
    category: 'Luxury Box Collection'
  },
  {
    id: 6,
    name: 'Peony Paradise',
    price: 329.99,
    description: 'Exquisite pink peonies with elegant wrapping and premium presentation',
    image: floral6,
    category: 'Signature Collection'
  }
]

function App() {
  const [cart, setCart] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    alert(`Checkout functionality:\n\nTotal: $${getTotalPrice()}\n\nIn a production environment, this would:\n1. Send cart data to your backend server\n2. Create a Stripe Checkout Session\n3. Redirect to Stripe's secure payment page\n\nYou'll need to:\n- Set up a backend server (Node.js/Express, Python/Flask, etc.)\n- Add your Stripe Secret Key to the backend\n- Add your Stripe Publishable Key to the frontend\n- Implement Stripe Checkout Session creation\n\nSee README.md for detailed setup instructions.`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sticky Navigation */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-5 lg:py-6">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-black hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Centered Logo */}
            <div className="flex-1 flex justify-center items-center">
              <img 
                src={logo} 
                alt="Dime LUXURE Florals" 
                className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] max-w-[500px] h-auto object-contain"
                style={{ maxHeight: '160px' }}
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button className="p-2 text-black hover:text-gold rounded-full transition-colors">
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative p-2 text-black hover:text-gold rounded-full transition-colors">
                    <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-black text-white text-xs font-bold">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-serif">Your Cart</SheetTitle>
                    <SheetDescription>
                      {getTotalItems() === 0 ? 'Your cart is empty' : `${getTotalItems()} item(s) in cart`}
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Flower2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Start shopping to add items</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-base mb-1">{item.name}</h4>
                                <p className="text-sm text-neutral-600 font-semibold">${item.price}</p>
                                <div className="flex items-center gap-2 mt-3">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 border-neutral-300"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7 border-neutral-300"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex justify-between items-center text-xl font-serif font-bold border-t pt-4">
                            <span>Total:</span>
                            <span>${getTotalPrice()}</span>
                          </div>
                          <Button
                            className="w-full gap-2 bg-black hover:bg-neutral-800 text-white"
                            size="lg"
                            onClick={handleCheckout}
                          >
                            <CreditCard className="h-5 w-5" />
                            Checkout with Stripe
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-neutral-200 py-4">
              <nav className="space-y-2">
                <a href="#collections" className="block px-4 py-2 text-black hover:text-gold hover:bg-neutral-100 rounded transition-colors">Collections</a>
                <a href="#about" className="block px-4 py-2 text-black hover:text-gold hover:bg-neutral-100 rounded transition-colors">About</a>
                <a href="#contact" className="block px-4 py-2 text-black hover:text-gold hover:bg-neutral-100 rounded transition-colors">Contact</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section className="relative h-[400px] md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${floral3})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6">
              Bespoke Floral Artistry
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8">
              Luxury arrangements crafted for life's most precious moments
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-neutral-100 font-semibold px-8 py-6 text-lg"
              onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section id="collections" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-sm uppercase tracking-wider text-neutral-500 mb-2">Featured Collections</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900">
              Our Signature Arrangements
            </h2>
          </div>
          
          {/* Products Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map(product => (
              <Card key={product.id} className="group overflow-hidden border border-neutral-200 hover:shadow-xl transition-all duration-300">
                <div className="aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="text-center pb-3">
                  <Badge variant="outline" className="mx-auto mb-3 border-neutral-300 text-neutral-600 text-xs">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-xl md:text-2xl font-serif">{product.name}</CardTitle>
                  <CardDescription className="text-sm md:text-base mt-2">{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3 pt-0">
                  <span className="text-2xl md:text-3xl font-serif font-bold text-neutral-900">${product.price}</span>
                  <Button 
                    onClick={() => addToCart(product)} 
                    className="w-full gap-2 bg-black hover:bg-neutral-800 text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <img 
                src={floral5} 
                alt="Luxury Florals" 
                className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-neutral-500 mb-3">About Us</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-6">
                Dime LUXURE Florals
              </h2>
              <div className="space-y-4 text-neutral-700 text-base md:text-lg leading-relaxed">
                <p>
                  Based in Toronto, Dime LUXURE Florals specializes in creating bespoke floral arrangements that embody elegance and sophistication. Each design is meticulously crafted using the finest premium blooms, ensuring every arrangement tells a unique story.
                </p>
                <p>
                  From intimate celebrations to grand occasions, our luxury floral artistry transforms moments into unforgettable memories. We source only the highest quality flowers and combine them with designer-inspired presentations that reflect your personal style.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-700">Toronto, Ontario</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-700">(416) 555-LUXE</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <span className="text-neutral-700">hello@dimeluxure.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <img src={logo} alt="Dime LUXURE Florals" className="h-12 md:h-16 w-auto mb-4 brightness-0 invert" />
              <p className="text-neutral-400 text-sm md:text-base max-w-md">
                Toronto's premier destination for luxury bespoke floral arrangements. Transforming moments into unforgettable memories.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Collections</h4>
              <ul className="space-y-2 text-neutral-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Signature Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seasonal Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Luxury Box Collection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Services</h4>
              <ul className="space-y-2 text-neutral-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Bespoke Arrangements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wedding Florals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Corporate Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Same-Day Delivery</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-neutral-500 text-sm border-t border-neutral-800 pt-8">
            <p>&copy; 2025 Dime LUXURE Florals. All rights reserved.</p>
            <p className="mt-2">www.dimeluxure.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

