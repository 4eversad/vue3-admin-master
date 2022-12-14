export const removeHtmlTags = (str, allowed_tags) => {
  let key = '', allowed = false
  let matches = []
  let allowed_array = []
  let allowed_tag = ''
  let i = 0
  let k = ''
  let html = ''
  let replacer = function (search, replace, str) {
      return str.split(search).join(replace)
  }
  // Build allowes tags associative array
  if (allowed_tags) {
      allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi)
  }
  str += ''

  // Match tags
  matches = str.match(/(<\/?[\S][^>]*>)/gi)
  // Go through all HTML tags
  for (key in matches) {
      if (isNaN(key)) {
          // IE7 Hack
          continue
      }

      // Save HTML tag
      html = matches[key].toString()
      // Is tag not in allowed list? Remove from str!
      allowed = false

      // Go through all allowed tags
      for (k in allowed_array) {            // Init
          allowed_tag = allowed_array[k]
          i = -1

          if (i != 0) {
              i = html.toLowerCase().indexOf('<' + allowed_tag + '>')
          }
          if (i != 0) {
              i = html.toLowerCase().indexOf('<' + allowed_tag + ' ')
          }
          if (i != 0) {
              i = html.toLowerCase().indexOf('</' + allowed_tag)
          }

          // Determine
          if (i == 0) {
              allowed = true
              break
          }
      }
      if (!allowed) {
          str = replacer(html, "", str) // Custom replace. No regexing
      }
  }
  return str
}