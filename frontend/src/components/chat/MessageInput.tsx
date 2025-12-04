import { useAuthStore } from "@/stores/useAuthStore";
import type { Conversation } from "@/types/chat";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({
    selectedConversation,
}: {
    selectedConversation: Conversation;
}) => {
    const { user } = useAuthStore();
    const [value, setValue] = useState("");

    if (!user) return;

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
            <Button className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105" disabled={value.trim() === ""}>
                <Send className="size-4 text-white" />
            </Button>
        </div>
    );
};

export default MessageInput;
