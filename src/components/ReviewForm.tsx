'use client';

import { createReview } from "@/app/actions/reviewActions";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type Props = {
    targetUserId: string;
    onReviewAdded?: () => void;
};

export default function ReviewForm({ targetUserId, onReviewAdded }: Props) {
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }
        setIsSubmitting(true);
        setError("");

        try {
            await createReview(targetUserId, rating, comment);
            setRating(0);
            setComment("");
            onReviewAdded?.();
            // maybe show success message
        } catch (err: any) {
            setError(err.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!user) return <p className="text-sm text-gray-500">Log in to leave a review.</p>;
    if (user.id === targetUserId) return null;

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border mt-4">
            <h3 className="font-bold mb-2">Write a Review</h3>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="mb-3">
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Rating</label>
                <StarRating rating={rating} onChange={setRating} />
            </div>

            <div className="mb-3">
                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Comment</label>
                <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe your experience..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-walmart-blue text-white py-1 px-4 rounded text-sm font-bold hover:bg-walmart-darkBlue disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
