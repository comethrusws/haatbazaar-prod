'use client';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/components/CartContext";
import { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaPlus, FaInbox } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { cart, setCartOpen } = useCart();
  const [searchValue, setSearchValue] = useState(searchParams.get('phrase') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/ads/autocomplete?q=${encodeURIComponent(searchValue)}`);
      const data = await res.json();
      setSuggestions(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchValue.trim()) {
      router.push(`/?phrase=${encodeURIComponent(searchValue)}`);
    } else {
      router.push('/');
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50 shadow-lg"
      onClick={() => setShowSuggestions(false)}
    >
      <div className="container-main flex items-center h-16 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-white text-blue-600 font-black text-xl px-2 py-1 rounded-lg">
            HB
          </div>
          <span className="font-bold text-xl hidden sm:block">Haatbazaar</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow flex items-center relative max-w-2xl"
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              className="w-full text-gray-900 rounded-lg py-2.5 px-4 pr-12 focus:ring-4 focus:ring-yellow-400/50 border-none outline-none text-sm"
              placeholder="Search products, brands, and categories..."
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 size-8 rounded-md flex items-center justify-center transition"
            >
              <FaSearch className="h-4 w-4" />
            </button>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white text-gray-900 mt-1 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition border-b border-gray-50 last:border-none text-sm"
                    onClick={() => {
                      setSearchValue(suggestion);
                      setShowSuggestions(false);
                      router.push(`/?phrase=${encodeURIComponent(suggestion)}`);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2">
          <SignedIn>
            {/* My Ads */}
            <Link
              href="/my-ads"
              className="hidden md:flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              <span>My Ads</span>
            </Link>

            {/* Inbox */}
            <Link
              href="/inbox"
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              <FaInbox className="h-4 w-4" />
              <span className="hidden md:inline">Inbox</span>
            </Link>

            {/* Sell Button */}
            <Link
              href="/new"
              className="hidden md:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm transition"
            >
              <FaPlus className="h-3 w-3" />
              <span>Sell</span>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition">
                <FaUser className="h-4 w-4" />
                <span className="hidden md:inline">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
          >
            <div className="relative">
              <FaShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-bold size-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-sm font-bold hidden md:inline">
              {cartTotal > 0 ? `Rs ${(cartTotal / 1000).toFixed(0)}k` : 'Cart'}
            </span>
          </button>

          {/* User Menu */}
          <SignedIn>
            <div className="ml-1 flex items-center gap-3">
              <Link href={`/profile/${user?.id}`} className="hidden md:flex flex-col items-end text-xs hover:bg-white/10 p-2 rounded px-3 transition">
                <span className="font-bold">{user?.firstName}</span>
                <span className="opacity-70">Earnings & Profile</span>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-9 border-2 border-white/50"
                  }
                }}
              />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
