var FTPS = require('ftps');

class gestFtps {
  constructor(host, username, password, protocol, port) {
    this.ftps = new FTPS({
      host: host,
      username: username,
      password: password,
      protocol: protocol,
      port: port,
      autoConfirm:true
    })
  }

  putFile(pathLocal, pathDistant) {
    return new Promise((resolve, reject) => {
      this.ftps.cd(pathDistant)
      this.ftps.put(pathLocal, [""])
      this.ftps.exec(function (err, res) {
        if(err) reject(Error(err))
        resolve(res)
      })
    })
  }
}
module.exports = gestFtps
