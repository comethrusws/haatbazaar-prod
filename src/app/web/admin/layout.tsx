import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faChartLine, faList, faTags, faTruck } from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        HB Admin
                    </h1>
                    <p className="text-xs text-gray-500">Mall Management</p>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/web/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/web/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                        <FontAwesomeIcon icon={faBox} className="w-5 h-5" />
                        <span className="font-medium">Inventory</span>
                    </Link>
                    <Link href="/web/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                        <FontAwesomeIcon icon={faList} className="w-5 h-5" />
                        <span className="font-medium">Categories</span>
                    </Link>
                    <Link href="/web/admin/offers" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                        <FontAwesomeIcon icon={faTags} className="w-5 h-5" />
                        <span className="font-medium">Offers</span>
                    </Link>
                    <Link href="/web/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                        <FontAwesomeIcon icon={faTruck} className="w-5 h-5" />
                        <span className="font-medium">Orders</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
