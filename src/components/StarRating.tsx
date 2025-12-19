'use client';

import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type Props = {
    rating?: number; // Current rating (for display)
    onChange?: (rating: number) => void; // If provided, it's interactive
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
};

export default function StarRating({ rating = 0, onChange, readOnly = false, size = "md" }: Props) {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = [1, 2, 3, 4, 5];
    const displayRating = hoverRating || rating;

    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-5 w-5",
        lg: "h-8 w-8"
    };

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} text-yellow-500 transition-colors`}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    onClick={() => !readOnly && onChange?.(star)}
                >
                    <FontAwesomeIcon
                        icon={star <= displayRating ? faStarSolid : faStarRegular}
                        className={sizeClasses[size]}
                    />
                </button>
            ))}
        </div>
    );
}
