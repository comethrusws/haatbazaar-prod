import { getCategories } from "@/actions/admin";
import CategoriesView from "@/components/admin/CategoriesView";

export default async function CategoriesPage() {
    const categories = await getCategories();
    return <CategoriesView categories={categories} />;
}
