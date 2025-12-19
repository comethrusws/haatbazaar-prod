import { getOrders } from "@/actions/admin";
import OrdersView from "@/components/admin/OrdersView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) redirect('/web/admin/login');

    const orders = await getOrders();
    return <OrdersView orders={orders} />;
}
