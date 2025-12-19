'use client';

import { createConversation } from "@/app/actions/chatActions";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function MessageButton({ adId }: { adId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleClick() {
        setIsLoading(true);
        try {
            const conversation = await createConversation(adId);
            router.push(`/inbox/${conversation.id}`);
        } catch (error) {
            console.error(error);
            alert("This is your own ad!");
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="border border-walmart-blue text-walmart-blue flex gap-2 items-center px-4 py-2 rounded font-bold hover:bg-blue-50 transition disabled:opacity-50"
        >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FontAwesomeIcon icon={faCommentDots} />}
            <span>Chat</span>
        </button>
    );
}
