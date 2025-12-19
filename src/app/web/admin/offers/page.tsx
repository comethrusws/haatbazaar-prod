import { getOffers } from "@/actions/admin";
import OffersView from "@/components/admin/OffersView";

export default async function OffersPage() {
    const offers = await getOffers();
    return <OffersView offers={offers} />;
}
