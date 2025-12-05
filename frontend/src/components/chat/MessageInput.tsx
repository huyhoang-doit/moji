import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const MessageInput = ({
    selectedConversation,
}: {
    selectedConversation: Conversation;
}) => {
    const { user } = useAuthStore();
    const [value, setValue] = useState("");

    // function form chat store
    const { sendDirectMessage, sendGroupMessage } = useChatStore();

    if (!user) return;

    const sendMessage = async () => {
        if (!value.trim()) return;
        const currenValue = value;
        setValue("");

        try {
            if (selectedConversation.type === 'direct') {
                const participants = selectedConversation.participants;
                const otherUser = participants.filter((p) => p._id !== user._id)[0];

                await sendDirectMessage(otherUser._id, currenValue.trim());
            } else if (selectedConversation.type === 'group') {
                await sendGroupMessage(selectedConversation._id, currenValue.trim());
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="flex items-center gap-2 p-3 min-h-[56px] bg-background">
            {/* Gửi file */}
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 transition-smooth"
            ></Button>
            <div className="flex-1 relative">
                {/*  Input */}
                <Input
                    onKeyDown={handleKeyDown}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Nhập tin nhắn"
                    className="pr-20 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth resize-none"
                ></Input>

                {/* emoji picker */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                        asChild // component sẽ truyền thuộc tính của Button vào component con
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-primary/10 transition-smooth"
                    >
                        <EmojiPicker onChange={(emoji) => setValue(`${value}${emoji}`)} />
                    </Button>
                </div>
            </div>
            {/* Gửi tin nhắn */}
            <Button className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105" disabled={value.trim() === ""}
                onClick={sendMessage}
            >
                <Send className="size-4 text-white" />
            </Button>
        </div>
    );
};

export default MessageInput;
