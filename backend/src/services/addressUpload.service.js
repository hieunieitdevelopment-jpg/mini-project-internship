const { convertOldToNew } = require("./oldToNew.service")

const convertAddresses = async (rows) => {

  const results = []

  for (const row of rows) {

    const address = row.address

    const converted = await convertOldToNew(address)

    results.push({
      input: address,
      result: converted
    })

  }

  return results

}

module.exports = { convertAddresses }