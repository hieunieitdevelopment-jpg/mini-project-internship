const { searchNewToOld } = require("../services/searchNewToOld.service");
const { fuzzySearch } = require("../services/fuzzySearch.service");


// convert new → old
exports.convertNewToOld = async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) {

      return res.status(400).json({
        success: false,
        message: "Query parameter q is required"
      });

    }

    const data = await searchNewToOld(q);

    res.json({
      success: true,
      total: data.length,
      data: data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



// fuzzy search
exports.fuzzySearch = async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) {

      return res.status(400).json({
        success: false,
        message: "Query parameter q is required"
      });

    }

    const data = await fuzzySearch(q);

    res.json({
      success: true,
      total: data.length,
      data: data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};