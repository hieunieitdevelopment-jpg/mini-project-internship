const dropdownService = require("../services/dropdown.service");


exports.getProvinces = async (req, res) => {
    try {
        const result = await dropdownService.getProvinces();
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const { provinceId } = req.query;
        if (!provinceId) {
            return res.status(400).json({ success: false, message: "Cần truyền provinceId" });
        }
        const result = await dropdownService.getDistricts(provinceId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};

exports.getWards = async (req, res) => {
    try {
        const { districtId } = req.query;
        if (!districtId) {
            return res.status(400).json({ success: false, message: "Cần truyền districtId" });
        }
        const result = await dropdownService.getWards(districtId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
};
