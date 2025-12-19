import { getMessages, getConversations } from "@/app/actions/chatActions";
import ChatWindow from "@/components/ChatWindow";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function InboxDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await currentUser();
    if (!user) return <div>Please log in</div>;

    const messages = await getMessages(params.id);
    const conversations = await getConversations();
    const conversation = conversations.find((c: any) => c.id === params.id);

    if (!conversation) {
        return <div>Conversation not found</div>;
    }

    const otherParticipant = conversation.participants.find((p: any) => p.id !== user.id);
    const recipientName = otherParticipant?.email || 'User';

    return (
        <div className="container-main py-4 h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-4">
                <a href="/inbox" className="text-sm text-gray-500 hover:underline">&larr; Back to Inbox</a>
            </div>
            <ChatWindow
                conversationId={params.id}
                initialMessages={messages}
                recipientName={recipientName}
            />
        </div>
    );
}
