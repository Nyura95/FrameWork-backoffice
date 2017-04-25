const mysql = require('mysql')
const delay = require('./delay')

class gestMysql extends delay{
  constructor(base = "easering") {
    super()
    this.setConnection(base)
  }
  setConnection(base) {
    /*this.connection = mysql.createConnection({
      host : 'localhost',
      user       : 'root',
      password   : 'root',
      database   : base
    })*/
    this.connection = mysql.createConnection({
      socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
      user       : 'root',
      password   : 'root',
      database   : base
    })
    /*this.connection = mysql.createConnection({
      socketPath : '/var/run/mysqld/mysqld.sock',
      user       : 'root',
      password   : 'yfful95df',
      database   : base
    })*/
    return true

  }

  sendRequest(string, ...params) {
    return new Promise((resolve, reject) =>{
      try {
        this.startConnection()
        this.getConnection().query(string, params, (err, rows) => {
          if(err) reject(Error(err))
          this.stopConnection()
          resolve(rows)
        })
      } catch (e) {
          reject(Error(e))
      }
    })
  }

  sendRequestCallback(string, params, callback) {
    this.startConnection()
    this.getConnection().query(string, params, (err, rows) => {
      if(err) {
        callback(err, false)
      }
      callback(false, rows)
      this.stopConnection()
    })
  }

  getConnection() { return this.connection }
  startConnection() {
    try {
      this.connection.connect()
    } catch(e) {
      console.error(e)
    }

  }
  async stopConnection() {
    this.startDelay(3000).then(() =>{
      this.connection.end()
    }).catch(function(error) {
      console.log(error)
    })
  }
}

module.exports = gestMysql
