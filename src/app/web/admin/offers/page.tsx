import { getOffers } from "@/actions/admin";
import OffersView from "@/components/admin/OffersView";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OffersPage() {
    const cookieStore = await cookies();
    if (!cookieStore.get('admin_session')) redirect('/web/admin/login');

    const offers = await getOffers();
    return <OffersView offers={offers} />;
}
