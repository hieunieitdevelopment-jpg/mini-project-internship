const addressService = require("../services/ searchOldToNew.service");
const suggestService = require("../services/suggest.service");

exports.convertOldToNew = async (req, res) => {
    try {
        const { province, district, ward } = req.query;

        if (!province || !district || !ward) {
            return res.status(400).json({
                success: false,
                message: "Cần có thông tin về tỉnh, huyện và phường."
            });
        }

        const result = await addressService.convertOldToNew(
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
            message: "lỗi máy chủ"
        });
    }
};

exports.suggestAddress = async (req, res) => {
  try {

    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Keyword q is required"
      });
    }

    const result = await suggestService.suggestAddress(
      q,
      limit || 10
    );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: " lỗi server"
    });

  }
};