const AdminModel = require("../models/admin.model");

// Lấy số liệu tổng quan hệ thống
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await AdminModel.getGlobalStats();
        const traffic30d = await AdminModel.get30DaysTraffic();
        const topConsumers = await AdminModel.getTopConsumers();

        return res.json({
            success: true,
            data: {
                stats,
                traffic: traffic30d,
                topConsumers
            }
        });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi tải Dashboard Stats" });
    }
};

// Lấy toàn bộ Users
exports.getUsers = async (req, res) => {
    try {
        const users = await AdminModel.getAllUsersWithStats();
        return res.json({ success: true, data: users });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi tải quản lý Users" });
    }
};

// Thay đổi trạng thái User (Khóa / Mở khóa)
exports.toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;
        
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ success: false, message: "Tham số isActive phải là boolean" });
        }

        // Không cho admin tự khóa chính mình
        if (userId === req.user.id) {
            return res.status(400).json({ success: false, message: "Không thể tự khóa tài khoản của chính mình!" });
        }

        const updatedUser = await AdminModel.setUserStatus(userId, isActive);
        return res.json({ 
            success: true, 
            message: isActive ? "Đã mở khóa tài khoản thành công" : "Đã khóa (ban) tài khoản thành công",
            data: updatedUser 
        });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi khóa tài khoản" });
    }
};

// Quản lý tất cả API Keys
exports.getAllApiKeys = async (req, res) => {
    try {
        let keys = await AdminModel.getAllApiKeys();
        
        // Che API key một chút để an toàn, nhưng admin vẫn thấy một đoạn
        keys = keys.map(k => {
           if(k.api_key && k.api_key.length > 20) {
               k.masked_key = k.api_key.substring(0, 8) + '********************************' + k.api_key.substring(k.api_key.length - 4);
           }
           return k;
        });

        return res.json({ success: true, data: keys });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi tải danh sách API Keys" });
    }
};

// Admin Xóa thẳng tay API Key (Thu hồi khẩn cấp)
exports.revokeKeyGlobal = async (req, res) => {
    try {
        const { keyId } = req.params;
        const revokedKey = await AdminModel.revokeKeyGlobal(keyId);
        
        if (!revokedKey) {
            return res.status(404).json({ success: false, message: "Không tìm thấy API Key" });
        }

        return res.json({ 
            success: true, 
            message: "Đã thu hồi tước quyền API Key khẩn cấp thành công", 
            data: revokedKey 
        });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi thu hồi API Key" });
    }
};

// Admin xóa vĩnh viễn User

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Không cho admin tự xóa chính mình
        if (userId === req.user.id) {
            return res.status(400).json({ success: false, message: "Không thể tự xóa tài khoản của chính mình!" });
        }

        // Kiểm tra không cho xóa admin khác
        const AdminModel = require("../models/admin.model");
        const users = await AdminModel.getAllUsersWithStats();
        const targetUser = users.find(u => u.id === userId);
        if (targetUser && targetUser.role === 'admin') {
            return res.status(400).json({ success: false, message: "Không thể xóa tài khoản Admin!" });
        }

        const deletedUser = await AdminModel.deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        return res.json({
            success: true,
            message: `Đã xóa vĩnh viễn tài khoản ${deletedUser.email}`,
            data: deletedUser
        });
    } catch (error) {
        console.error("Admin Controller Error: ", error);
        return res.status(500).json({ success: false, message: "Lỗi xóa tài khoản" });
    }
};
