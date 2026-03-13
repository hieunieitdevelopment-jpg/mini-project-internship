const addressService = require("../services/addressService");

exports.convertOldToNew = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        // validate input
        if ( !province || !district || !ward) {
            return res.status(400). json({
                success: false,
                message: "Cần có thông tin về tỉnh, huyện và phường."
            });
        }

        const result = await addressService. convertOldToNew(
            province,
            district,
            ward
        );

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error){
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "lỗi máy chủ"
        });
        
    }

};

