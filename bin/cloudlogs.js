'use strict'

const { Logs } = require('../lib/aws')

const stream = process.stdout

let first = true
function handler (events) {
  if (first) {
    first = false
  } else {
    stream.write(',')
  }
  stream.write(JSON.stringify(events, null, 2).slice(1, -2))
}

const pieces = (process.argv[1] || '').split(':', 2)

const params = {
  logGroupName: pieces[0],
  handler
}

if (pieces.length > 1) {
  params.logStreamNames = [pieces[1]]
}

stream.write('[')
Logs.filterLogEvents(params)
  .then(() => {
    stream.write('\n]')
    stream.end()
  })
