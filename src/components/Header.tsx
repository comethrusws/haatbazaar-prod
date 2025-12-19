'use client';
import { faCartShopping, faSearch, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { cart, setCartOpen } = useCart();
  const [searchValue, setSearchValue] = useState(searchParams.get('phrase') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?phrase=${encodeURIComponent(searchValue)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-walmart-blue text-white sticky top-0 z-50">
      <div className="container-main flex items-center h-20 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-bold text-2xl tracking-tight">Haatbazaar</span>
          <div className="bg-walmart-yellow size-3 rounded-full group-hover:animate-pulse"></div>
        </Link>

        {/* Mobile Menu (Hidden on Desktop) */}
        <button className="md:hidden text-white">
          <FontAwesomeIcon icon={faBars} className="h-6" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow hidden md:flex items-center relative">
          <input
            type="text"
            className="w-full text-black rounded-full py-2 px-4 pr-12 focus:ring-4 focus:ring-walmart-yellow/50 border-none outline-none"
            placeholder="Search everything at Haatbazaar online and in store"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-walmart-yellow text-walmart-darkBlue size-8 rounded-full flex items-center justify-center hover:bg-yellow-400 transition"
          >
            <FontAwesomeIcon icon={faSearch} className="h-4" />
          </button>
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-6">
          <SignedIn>
            <div className="flex flex-col items-center text-xs hover:bg-black/10 p-2 rounded-full px-4 cursor-pointer transition">
              <span className="font-bold">Hi, {user?.firstName}</span>
              <span className="text-[10px]">Account</span>
            </div>
            {/* Post Ad Button (Custom for Marketplace) */}
            <Link href="/new" className="hidden md:block bg-transparent border border-white/50 rounded-full px-4 py-1.5 text-sm font-bold hover:bg-white/10 transition">
              Post Ad
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex flex-col items-center text-xs hover:bg-black/10 p-2 rounded-full px-4 cursor-pointer transition">
                <FontAwesomeIcon icon={faUser} className="h-4 mb-0.5" />
                <span className="font-bold">Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>

          <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center text-xs hover:bg-black/10 p-2 rounded-full px-3 cursor-pointer transition">
            <div className="relative">
              <FontAwesomeIcon icon={faCartShopping} className="h-5 mb-0.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-walmart-yellow text-walmart-blue text-[10px] font-bold size-4 flex items-center justify-center rounded-full border border-walmart-blue">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="font-bold mt-0.5">{Number(cart.reduce((total, item) => total + item.price, 0) / 1000).toFixed(0)}k</span>
          </button>

          <div className="ml-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "size-8" } }} />
            </SignedIn>
          </div>
        </nav>
      </div>

      {/* Mobile Search (Below Header) */}
      <div className="md:hidden pb-4 px-4 container-main">
        <form onSubmit={handleSearch} className="flex items-center relative">
          <input
            type="text"
            className="w-full text-black rounded-full py-2 px-4 pr-12 text-sm border-none outline-none"
            placeholder="Search Haatbazaar"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-walmart-yellow text-walmart-darkBlue size-8 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSearch} className="h-3" />
          </button>
        </form>
      </div>
    </header>
  );
}
