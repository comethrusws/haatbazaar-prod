import { getMallInventory, getCategories } from "@/actions/admin";
import InventoryView from "@/components/admin/InventoryView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) redirect('/web/admin/login');

    const products = await getMallInventory();
    const categories = await getCategories();

    return (
        <InventoryView products={products} categories={categories} />
    );
}
