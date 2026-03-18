const path = require("path")

const { parseCSV } = require("../services/csvParser.service")
const { parseExcel } = require("../services/excelParser.service")
const { convertAddresses } = require("../services/addressUpload.service")

const uploadFile = async (req, res, next) => {

  try {

    const file = req.file   

    if (!file) {

      return res.status(400).json({
        success: false,
        message: "File is required"
      })

    }

    const ext = path.extname(file.originalname)

    let data

    if (ext === ".csv") {
      data = await parseCSV(file.path)
    } else {
      data = parseExcel(file.path)
    }

    const result = await convertAddresses(data)

    res.json({
      success: true,
      total: result.length,
      data: result
    })

  } catch (error) {

    next(error)

  }

}

module.exports = { uploadFile }