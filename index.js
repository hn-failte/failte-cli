#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('@inquirer/prompts')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const sqlite = require('./sqlite')

const home = process.env.HOME || ''
const config_path = path.join(home, '.failterc')

async function isLogin() {
  console.log('existsSync', fs.existsSync(config_path))
  if (!fs.existsSync(config_path)) {
    return false
  }

  const config_str = fs.readFileSync(config_path, 'utf8')
  if (config_str) {
    try {
      const config = JSON.parse(config_str)
      console.log(config)
      return !!config.token
    } catch (error) {
      console.log('config parse error!')
      return false
    }
  }
}

async function login() {
  const userName = await inquirer.input(
    { message: 'Enter your userName?' },
    {
      clearPromptOnDone: true,
    },
  )
  const password = await inquirer.password(
    { message: 'Enter your password?' },
    {
      clearPromptOnDone: true,
    },
  )
  console.log('login success!')
}

async function run() {
  yargs(hideBin(process.argv))
    .command('status', 'watch status', () => {
      console.log('get status')
    })
    .command(
      'stay [hour]',
      'stay',
      argv => {
        return argv.positional('hour', {
          describe: 'stay hour',
          default: 5000,
        })
      },
      argv => {
        console.log('stay ' + argv.hour + ' hour')
      },
    )
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .parse()
}

async function main() {
  if (!(await isLogin())) {
    await login()
  }
  await run()

  //   const db = await sqlite.init()
  //   await db.exec('CREATE TABLE role(id TEXT, name TEXT, exp INT);').then(res => {
  //     console.log('res', res)
  //   })
  //   const res = await db.all('SELECT * FROM role')
  //   const res = await db.run('INSERT INTO role (id, name, exp) VALUES (?, ?, ?)', [
  //     '10000',
  //     'failte',
  //     0,
  //   ])
  //   const res = await db.run('DELETE from role where id = ?', '10000')
  //   console.log('res', res)
}

main()
