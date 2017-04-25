const gestMysql = require('./gestMysql')

class settings {
  getAllSettings() {
    return new Promise((resolve, reject) =>{
      new gestMysql().sendRequestCallback("SELECT * FROM settings", [], (err, rows) => {
        if(err) reject(Error(err))
        this.settings = rows
        resolve(rows)
      })
    })
  }
  getSettingsById(id) {
    return new Promise((resolve, reject) =>{
      new gestMysql().sendRequestCallback("SELECT * FROM settings", [], (err, rows) => {
        if(err) reject(Error(err))
        let tmp = new Array()
        for(let i = 0;i<rows.length;i++) {
          if(rows[i].idconfig == id) {
            tmp.push(rows[i])
          }
        }
        resolve(tmp)
      })
    })
  }

  getName(params, name) {
    for(let i = 0;i<params.length;i++) {
      if(params[i].name == name) {
        return params[i]
      }
    }
  }
}

module.exports = settings;
