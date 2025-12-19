
import { getConversations, getMessages } from "@/app/actions/chatActions";
import ChatWindow from "@/components/ChatWindow";
import { currentUser } from "@clerk/nextjs/server";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
    const user = await currentUser();
    if (!user) return <div>Please log in</div>;

    const conversations = await getConversations();

    return (
        <div className="container-main py-8">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No messages yet</div>
                ) : (
                    <div className="divide-y">
                        {conversations.map((conv: any) => {
                            const otherParticipant = conv.participants.find((p: any) => p.id !== user.id);
                            const lastMsg = conv.messages[0];

                            return (
                                <Link
                                    href={`/inbox/${conv.id}`}
                                    key={conv.id}
                                    className="p-4 hover:bg-gray-50 flex justify-between items-center group transition"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="size-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                                            {otherParticipant?.email?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-walmart-blue transition">
                                                {otherParticipant?.email || 'User'}
                                                {conv.ad && <span className="text-gray-400 font-normal text-xs ml-2">re: {conv.ad.title}</span>}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-1 w-64 md:w-96">
                                                {lastMsg?.content || 'Started a conversation'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
