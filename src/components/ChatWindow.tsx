'use client';

import { sendMessage } from "@/app/actions/chatActions";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type Message = {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    sender: { name?: string, email: string, avatar?: string };
};

type Props = {
    conversationId: string;
    initialMessages: Message[];
    recipientName: string;
};

export default function ChatWindow({ conversationId, initialMessages, recipientName }: Props) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function handleSend(formData: FormData) {
        const content = formData.get('content') as string;
        if (!content.trim()) return;

        setNewMessage('');

        // optimistic update
        const optimisticMsg: Message = {
            id: 'temp-' + Date.now(),
            content: content,
            createdAt: new Date().toISOString(),
            senderId: user?.id || 'me',
            sender: { email: user?.primaryEmailAddress?.emailAddress || '' }
        };

        setMessages(prev => [...prev, optimisticMsg]);

        await sendMessage(conversationId, content);
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <div className="size-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {recipientName[0]?.toUpperCase()}
                    </div>
                    {recipientName}
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100/50">
                {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                    ? 'bg-walmart-blue text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border rounded-bl-none'
                                }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form
                ref={formRef}
                action={handleSend}
                className="p-3 border-t bg-white flex gap-2"
            >
                <input
                    type="text"
                    name="content"
                    className="flex-grow border rounded-full px-4 py-2 focus:ring-2 focus:ring-walmart-blue outline-none text-sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="bg-walmart-blue text-white size-9 rounded-full flex items-center justify-center hover:bg-walmart-darkBlue transition"
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="h-4" />
                </button>
            </form>
        </div>
    );
}
