import { getOrders } from "@/actions/admin";
import OrdersView from "@/components/admin/OrdersView";

export default async function OrdersPage() {
    const orders = await getOrders();
    return <OrdersView orders={orders} />;
}
