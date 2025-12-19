import AdItem from "@/components/AdItem";
import { prisma } from "@/libs/db";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categories } from "@/libs/helpers";
import { BiCheck, BiLock, BiSolidTruck, BiStar } from "react-icons/bi";

export const dynamic = 'force-dynamic';

const MALL_USER_ID = 'haatbazaar-mall';

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const phrase = Array.isArray(searchParams.phrase) ? searchParams.phrase[0] : searchParams.phrase;
  const category = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;

  const where: any = { status: 'ACTIVE' };

  if (phrase) {
    where.title = { contains: phrase, mode: 'insensitive' };
  }
  if (category) {
    where.category = category;
  }

  const categoriesFound = await prisma.category.findMany({ orderBy: { label: 'asc' } });

  const displayCategories = categoriesFound.length > 0 ? categoriesFound.map(c => ({
    key: c.key,
    label: c.label,
    icon: c.icon === 'faMobile' ? categories.find(cat => cat.key === 'electronics')?.icon : categories.find(cat => cat.key === 'other')?.icon || categories[0].icon
  })) : categories;

  const mappedCategories = categoriesFound.length > 0 ? categoriesFound.map(c => {
    const staticMatch = categories.find(sc => sc.key === c.key);
    return {
      ...c,
      icon: staticMatch ? staticMatch.icon : categories[5].icon // default to asterisk
    };
  }) : categories;


  const mallProducts = await prisma.ad.findMany({
    where: { userId: MALL_USER_ID, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  if (!where.userId) {
    where.userId = { not: MALL_USER_ID };
  }

  const ads = await prisma.ad.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 24,
  });

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      {!phrase && !category && (
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200')] bg-cover bg-center opacity-20"></div>
          <div className="relative px-8 py-16 md:py-24 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Expect more. Pay Less.</h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 max-w-xl">
              Nepal's trusted managed marketplace. Buy from verified local and international sellers with secure payments and fast delivery.
            </p>
            <div className="flex gap-3">
              <Link href="#mall" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                Explore Mall
              </Link>
              <Link href="/new" className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Shop by Category</h2>
          {category && (
            <Link href="/" className="text-sm text-blue-600 hover:underline">Clear Filter</Link>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {mappedCategories.map(cat => (
            <Link
              key={cat.key}
              href={`/?category=${cat.key}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition ${category === cat.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
            >
              <FontAwesomeIcon icon={cat.icon} className="h-4 w-4" />
              <span className="font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HaatBazaar Mall Section */}
      {!phrase && !category && mallProducts.length > 0 && (
        <section id="mall" className="bg-gradient-to-b from-blue-50 to-white -mx-4 px-4 py-8 md:rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-md">
                Official Store
              </div>
              <h2 className="text-2xl font-bold text-gray-900">HaatBazaar Mall</h2>
            </div>
            <Link href={`/?category=electronics`} className="text-sm font-bold text-blue-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mallProducts.map(ad => (
              <AdItem key={ad.id} ad={ad} isMall />
            ))}
          </div>
        </section>
      )}

      {/* Search Results or All Products */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {phrase ? `Results for "${phrase}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Pre-loved & Second Hand'}
          </h2>
          {!phrase && !category && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Community</span>
          )}
        </div>

        {ads.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map(ad => (
              <AdItem key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl py-16 text-center">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Browse all products →
            </Link>
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t">
        <div className="flex items-center gap-3 p-4">
          <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl"><BiCheck/></div>
          <div>
            <p className="font-bold text-gray-800">Verified Sellers</p>
            <p className="text-xs text-gray-500">100% authentic products</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl"><BiLock/></div>
          <div>
            <p className="font-bold text-gray-800">Secure Payments</p>
            <p className="text-xs text-gray-500">Khalti & IME Pay</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl"><BiSolidTruck/></div>
          <div>
            <p className="font-bold text-gray-800">Fast Delivery</p>
            <p className="text-xs text-gray-500">1 hour in Kathmandu</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl"><BiStar/></div>
          <div>
            <p className="font-bold text-gray-800">Buyer Protection</p>
            <p className="text-xs text-gray-500">Full refund guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
}
