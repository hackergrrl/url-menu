var linestream = require('line-stream')
var Menu = require('terminal-menu')
var fs = require('fs')
var ttys = require('ttys')
var opn = require('opn')

(function() {
  var items = []
  var longestLine = 0

  var lines = process.stdin.pipe(linestream())
  lines.on('data', function(line) {
    items.push(line)
    longestLine = Math.max(longestLine, line.length)
  })
  lines.on('end', function() {
    setupMenu(items)
  })
})()

function setupMenu(items) {
  menu = Menu({x:1, y:1, width:longestLine})
  menu.write('BEEP. SELECT URL, HUMAN.\n');
  menu.write('------------------------\n');
  for (var i in items) {
    menu.add(items[i])
  }

  menu.on('select', function(url) {
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
