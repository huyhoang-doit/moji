import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";


const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendShip = async (req, res, next) => {
    try {
        const me = req.user._id;
        const recipientId = req.body.recipientId ?? null;
        const memberIds = req.body.memberIds ?? [];

        if (!recipientId && memberIds.length === 0) {
            return res.status(400).json({ message: "Thiếu recipientId hoặc memberIds" });
        }

        // --- ✅ Kiểm tra gửi tin nhắn trực tiếp ---
        if (recipientId) {
            const friendship = await Friend.findOne({
                $or: [
                    { userA: me, userB: recipientId },
                    { userA: recipientId, userB: me },
                ],
            });


            if (!friendship) {
                return res.status(403).json({ message: "Chỉ có thể gửi tin nhắn cho bạn bè" });
            }

            return next(); // ✅ return ở đây để không chạy xuống dưới
        }

        // --- ✅ Kiểm tra tạo nhóm ---
        const friendChecks = memberIds.map(async (id) => {
            const [userA, userB] = pair(me, id.toString());
            const friendship = await Friend.findOne({ userA, userB });
            return friendship != null;
        });

        const results = await Promise.all(friendChecks);
        const notFriends = results.filter(result => !result);

        if (notFriends.length > 0) {
            return res.status(403).json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm", notFriends });
        }

        return next();

    } catch (error) {
        console.error("Lỗi trong middleware kiểm tra bạn bè", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};


export const checkGroupMembership = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id.toString();
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
        }
        const isMember = conversation.participants.some(p => p.userId.toString() === userId);
        if (!isMember) {
            return res.status(403).json({ message: "Bạn không phải là thành viên của cuộc trò chuyện này" });
        }
        req.conversation = conversation;

        next();
    } catch (error) {
        console.error("Lỗi trong middleware kiểm tra thành viên nhóm", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
