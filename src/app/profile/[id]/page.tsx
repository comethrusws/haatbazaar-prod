import { prisma } from "@/libs/db";
import AdItem from "@/components/AdItem";
import { getUserStats, getReviews } from "@/app/actions/reviewActions";
import ReviewForm from "@/components/ReviewForm";
import StarRating from "@/components/StarRating";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import EarningsCard from "@/components/EarningsCard";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ProfilePage(props: Props) {
    const params = await props.params;
    const userId = params.id;
    const loggedInUser = await currentUser();
    const isOwnProfile = loggedInUser?.id === userId;

    let user = await prisma.user.findUnique({
        where: { id: userId }
    });

    const ads = await prisma.ad.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
    });

    const stats = await getUserStats(userId);
    const reviews = await getReviews(userId);

    const displayName = user?.name || 'User';
    const displayEmail = user?.email || 'Hidden';

    return (
        <div className="container-main py-8">
            <div className="bg-white rounded-lg shadow border p-6 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="size-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-4xl text-gray-400 font-bold relative">
                    {user?.avatar ? (
                        <Image src={user.avatar} alt={displayName} fill className="object-cover" />
                    ) : (
                        displayName[0]?.toUpperCase()
                    )}
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-3xl font-bold">{displayName}</h1>
                    <p className="text-gray-500">{displayEmail}</p>
                    <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                        <StarRating rating={stats.averageRating} readOnly />
                        <span className="text-sm font-bold">({stats.totalReviews} reviews)</span>
                    </div>
                </div>
            </div>

            {isOwnProfile && user && (
                <EarningsCard balance={user.balance} accountNumber={user.accountNumber} />
            )}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Active Listings ({ads.length})</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {ads.map(ad => (
                            <AdItem key={ad.id} ad={ad} />
                        ))}
                    </div>
                    {ads.length === 0 && <p className="text-gray-500">No active listings.</p>}
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Reviews</h2>
                    <div className="space-y-4 mb-8">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-gray-50 p-4 rounded border">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-sm">{review.author?.name || 'Anonymous'}</p>
                                        <StarRating rating={review.rating} size="sm" readOnly />
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                        {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
                    </div>

                    <ReviewForm targetUserId={userId} />
                </div>
            </div>
        </div>
    );
}
