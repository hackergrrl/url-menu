var linestream = require('line-stream')
var Menu = require('terminal-menu')
var fs = require('fs')
var ttys = require('ttys')
var opn = require('opn')

function setupMenu(items, width) {
  var title = 'BEEP. SELECT URL, HUMAN.\n'
  width = Math.max(width, title.length)

  menu = Menu({x:1, y:1, width:width})
  menu.reset()
  menu.write(title);
  menu.write('------------------------\n');
  for (var i in items) {
    menu.add(items[i])
  }

  menu.on('select', function(url) {
    console.dir(url)
    menu.close()
    opn(url)
  })

  menu.on('close', function () {
    ttys.stdin.setRawMode(false);
    ttys.stdin.end()
  })

  ttys.stdin.setRawMode(true)
  ttys.stdin.pipe(menu.createStream()).pipe(process.stdout)
}

(function() {
  var items = []
  var longestLine = 0

  var lines = process.stdin.pipe(linestream())
  lines.on('data', function(line) {
    items.push(line)
    longestLine = Math.max(longestLine, line.length)
  })
  lines.on('end', function() {
    setupMenu(items, longestLine)
  })
})()
