import { getMallInventory, getCategories } from "@/actions/admin";
import InventoryView from "@/components/admin/InventoryView";

export default async function InventoryPage() {
    const products = await getMallInventory();
    const categories = await getCategories();

    return (
        <InventoryView products={products} categories={categories} />
    );
}
