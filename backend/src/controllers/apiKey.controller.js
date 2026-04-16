const crypto = require("crypto");
const ApiKey = require("../models/apiKey.model");


const generateKey = () => {
    return crypto.randomBytes(32).toString("hex");
};

exports.createKey = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Tên API Key không được để trống" });
        }

        const limitCount = 3; 
        const currentCount = await ApiKey.countActiveKeysByUser(userId);

        if (currentCount >= limitCount) {
            return res.status(403).json({ 
                success: false, 
                message: `Bạn đã đạt giới hạn tối đa ${limitCount} API Keys đang hoạt động.` 
            });
        }

        const newApiKeyString = "vnk_" + generateKey(); // Tiền tố (prefix) vnk_ (vn_key) dễ nhận dạng tương tự Stripe (sk_test_...)

        const newKey = await ApiKey.createApiKey(userId, newApiKeyString, name);
        
        // Trả key này về LUÔN CẢ CHUỖI cho user thấy MỘT LẦN DUY NHẤT. 
        return res.status(201).json({
            success: true,
            message: "Tạo API Key thành công",
            data: {
                ...newKey,
                api_key: newApiKeyString
            }
        });
    } catch (error) {
        console.error("Create API Key Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

exports.listKeys = async (req, res) => {
    try {
        const userId = req.user.id;
        let keys = await ApiKey.getKeysByUserId(userId);
        
        keys = keys.map(k => {
           if(k.api_key && k.api_key.length > 20) {
               k.masked_key = k.api_key.substring(0, 8) + '********************************' + k.api_key.substring(k.api_key.length - 4);
           }
           return k;
        });

        return res.status(200).json({ success: true, data: keys });
    } catch (error) {
        console.error("List API Keys Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};

exports.revokeKey = async (req, res) => {
    try {
        const userId = req.user.id;
        const keyId = req.params.id;

        const revokedKey = await ApiKey.revokeKey(keyId, userId);
        
        if (!revokedKey) {
            return res.status(404).json({ success: false, message: "Không tìm thấy API Key hoặc bạn không có quyền phế bỏ" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Đã thu hồi API Key thành công", 
            data: revokedKey 
        });

    } catch (error) {
        console.error("Revoke API Key Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
};
