const oldToNewService = require("../services/searOldToNew.service");
const newToOldService = require("../services/searNewtoOld.service");


// convert cu -> moi
exports.convertOldToNew = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        if (!province && !district && !ward) {
            return res.status(400).json({
                success: false,
                message: "Cần ít nhất 1 thông tin: tỉnh, huyện hoặc xã"
            });
        }

        const result = await oldToNewService.convertOldToNew(province, district, ward);
        console.log(`convert old->new: found ${result.length} results`);

        res.json({ success: true, data: result });
    } catch (err) {
        console.log("convert old-to-new error:", err.message);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};


// convert moi -> cu
exports.convertNewToOld = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        if (!province && !district && !ward) {
            return res.status(400).json({
                success: false,
                message: "Cần ít nhất 1 thông tin"
            });
        }

        const result = await newToOldService.convertNewToOld(province, district, ward);

        res.json({ success: true, data: result });
    } catch (err) {
        console.log("loi convert new-to-old:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
