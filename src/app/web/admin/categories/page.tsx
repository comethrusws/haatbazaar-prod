import { getCategories } from "@/actions/admin";
import CategoriesView from "@/components/admin/CategoriesView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) redirect('/web/admin/login');

    const categories = await getCategories();
    return <CategoriesView categories={categories} />;
}
