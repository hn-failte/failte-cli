const fs = require('fs-extra')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const init = async () => {
  if (!fs.existsSync('./database.db')) {
    fs.writeFileSync('./database.db', '', 'utf8')
  }

  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  })

  db.on('trace', data => {
    console.log('data', data)
  })

  return db
}

module.exports = {
  init,
}
