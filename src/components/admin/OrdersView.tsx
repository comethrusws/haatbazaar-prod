'use client';

import { formatMoney, formatDate } from "@/libs/helpers";
import { updateOrderStatus } from "@/actions/admin";

export default function OrdersView({ orders }: { orders: any[] }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm">
                            <th className="p-4 border-b">Order ID</th>
                            <th className="p-4 border-b">Buyer</th>
                            <th className="p-4 border-b">Items</th>
                            <th className="p-4 border-b">Total</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">No orders found.</td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                // Try to parse items safely
                                let items: any[] = [];
                                try {
                                    items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as any);
                                } catch (e) { }

                                return (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="p-4 border-b font-mono text-xs">{order.id}</td>
                                        <td className="p-4 border-b">
                                            <div className="font-medium text-gray-900">{order.buyer?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{order.buyer?.email}</div>
                                        </td>
                                        <td className="p-4 border-b text-sm">
                                            {items.length} items
                                            {/* Could list items on hover or expand */}
                                        </td>
                                        <td className="p-4 border-b font-bold">{formatMoney(order.total)}</td>
                                        <td className="p-4 border-b text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'PAID' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b">
                                            <select
                                                defaultValue={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="border rounded text-sm p-1"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PAID">Paid</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
