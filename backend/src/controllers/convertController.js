const oldToNewService = require("../services/searOldToNew.service");
const newToOldService = require("../services/searNewtoOld.service");


exports.convertOldToNew = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        if (!province && !district && !ward) {
            return res.status(400).json({
                success: false,
                message: "Cần ít nhất 1 thông tin: tỉnh, huyện hoặc xã/phường."
            });
        }

        const result = await oldToNewService.convertOldToNew(
            province,
            district,
            ward
        );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};


exports.convertNewToOld = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        if (!province && !district && !ward) {
            return res.status(400).json({
                success: false,
                message: "Cần ít nhất 1 thông tin: tỉnh, huyện hoặc xã/phường."
            });
        }

        const result = await newToOldService.convertNewToOld(
            province,
            district,
            ward
        );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};
