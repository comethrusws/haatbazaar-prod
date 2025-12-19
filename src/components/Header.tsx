'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handlePostAdClick = () => {
    if (isLoaded && !user) {
      // If user is not logged in, you might want to redirect them to sign-in
      // or open the modal. For now, pushing to sign-in page is safe.
      // Clerk handles this via middleware mostly, but good for UX.
      // Actually, standard pattern is just let them click and if protected route, it redirects.
      // But here we want to encourage login.
      // Let's just push to /new and let middleware handle it?
      // Or explicit check:
      return router.push('/new');
    }
    router.push('/new');
  };

  return (
    <header className="border-b p-4 flex items-center justify-between h-16">
      <Link className="text-blue-600 font-bold text-2xl" href="/">
        Haatbazaar
      </Link>
      <nav className="flex items-center gap-4 *:rounded">
        <button
          onClick={handlePostAdClick}
          className="border border-blue-600 text-blue-600 inline-flex gap-1 items-center py-1 px-4 mr-4"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4" />
          <span>Post an ad</span>
        </button>
        <span className="border-r h-full border-gray-300 mx-2"></span>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white border-0 px-6 py-1 hover:bg-blue-700 transition">
              Login
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-2">
            <Link href="/my-ads" className="text-gray-600 hover:text-blue-600 mr-2">
              My Ads
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
}
