import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faChartLine, faList, faTags, faTruck, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { cookies } from "next/headers";
import { adminLogout } from "@/actions/adminAuth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    return (
        <div className="flex min-h-screen bg-gray-100">
            {session && (
                <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:block flex flex-col">
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            HB Admin
                        </h1>
                        <p className="text-xs text-gray-500">Mall Management</p>
                    </div>
                    <nav className="p-4 space-y-2 flex-grow">
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
                    <div className="p-4 border-t">
                        <form action={adminLogout}>
                            <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left">
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </form>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
