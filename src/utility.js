export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const mergeNames = (arr, locales, id) => {
  var output = []
  const array = arr
  array.forEach(function(obj) {
    const existing = output.filter(v => {
      return v[id] === obj[id]
    })
    if (existing.length) {
      const existingIndex = output.indexOf(existing[0])
      if (locales.indexOf(obj.locale) != -1) {
        output[existingIndex][obj.locale] = obj
      }
    } else {
      var temp = {
        slug: obj.slug,
      }
      if (locales.indexOf(obj.locale) != -1) {
        temp[obj.locale] = obj
      }
      output.push(temp)
    }
  })

  return output
}
