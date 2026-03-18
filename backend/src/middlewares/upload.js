const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname)
    cb(null, uniqueName)
  }

})

const fileFilter = (req, file, cb) => {

  const allowedTypes = [".csv", ".xlsx", ".xls"]

  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Only CSV or Excel files allowed"))
  }

}

const upload = multer({
  storage,
  fileFilter
})

module.exports = upload