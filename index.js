var getUrls = require('get-urls')
var concat = require('concat-stream')
var Menu = require('terminal-menu')
var ttys = require('ttys')
var opn = require('opn')

function setupMenu (items, width) {
  var title = 'BEEP. SELECT URL, HUMAN.\n'
  width = Math.max(width, title.length)

  var menu = Menu({x: 1, y: 1, width: width})
  menu.reset()
  menu.write(title)
  menu.write('------------------------\n')
  for (var i in items) {
    menu.add(items[i])
  }

  menu.on('select', function (url) {
    console.dir(url)
    menu.close()
    opn(url)
  })

  menu.on('close', function () {
    ttys.stdin.setRawMode(false)
    ttys.stdin.end()
  })

  ttys.stdin.setRawMode(true)
  ttys.stdin.pipe(menu.createStream()).pipe(process.stdout)
}

(function () {
  var items = []
  var longestLine = 0

  process.stdin.pipe(concat(function (text) {
    var urls = getUrls(text.toString())
    for (var i in urls) {
      var url = urls[i]
      items.push(url)
      longestLine = Math.max(longestLine, url.length)
    }
    setupMenu(items, longestLine)
  }))
})()
