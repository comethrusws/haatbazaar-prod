import { getMallInventory, getOrders } from "@/actions/admin";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) redirect('/web/admin/login');

    const inventory = await getMallInventory();
    const orders = await getOrders();

    const totalStock = inventory.reduce((acc: number, item: any) => acc + item.stock, 0);
    const lowStock = inventory.filter((item: any) => item.stock < 5).length;
    const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Products Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{inventory.length}</p>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <span className="font-medium">{totalStock}</span>
                        <span className="ml-2 text-gray-500">items in stock</span>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Low Stock Alerts</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                    <div className="mt-4">
                        <Link href="/web/admin/inventory" className="text-blue-600 text-sm hover:underline">Check Inventory →</Link>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
                    <div className="mt-4">
                        <Link href="/web/admin/orders" className="text-blue-600 text-sm hover:underline">Manage Orders →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
