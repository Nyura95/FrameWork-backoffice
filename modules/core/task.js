const ftps = require("./core/gestFtps")
const convertToCsv = require("./core/convertToCsv")
const schedule = require('node-schedule');


/*
UTILISATION :

let request = await new gestMysql("easeringapi").sendRequest("SELECT * FROM email")

let Task = new task({
  host:"5.196.69.227",
  username:"root",
  password:"yfful95df",
  port:"22",
  protocol:"sftp",
  path:"/home"
}, {
  heure:"10",
  minute:"19",
  seconde:"00"
}, request)

Task.StartTask()

*/

class task {
  constructor(connect, task, request) {
    try {
      if(typeof connect != "object" || Array.isArray(connect)) return console.error("the first argument need : {host, username, password, (port, protocol)}")
      this.connect =  {host:connect.host || "", username:connect.username || "", password:connect.password || "", port:connect.port || "21", protocol:connect.protocol || "ftp", path:connect.path || ""}
      if(typeof task != "object" || Array.isArray(task)) return console.error("the seconds arguments need : {jour, mois, annee, heure, minute, seconde}")
      this.task = {jour:task.jour || "*", mois:task.mois || "*", annee:task.annee || "*", heure:task.heure || "*", minute:task.minute || "*", seconde:task.seconde || "*"}
      if(!Array.isArray(request)) return console.error("the three arguments need a array")
      this.request = request
    } catch (e) {
      console.error(e)
    }

  }

  StartTask() {
    try {
      schedule.scheduleJob(this.task.seconde+" "+this.task.minute+" "+this.task.heure+" "+this.task.jour+" "+this.task.mois+" "+this.task.annee, async () => {
        let convert = new convertToCsv(this.request)
        let retour = await convert.startConvert("views/public/csv/name.csv")
        if(retour) {
          let sftp = new ftps(this.connect.host, this.connect.username, this.connect.password, this.connect.protocol, this.connect.port)
          let retour = await sftp.putFile("./views/public/csv/name.csv", this.connect.path)
          return console.log(retour)
        } else {
          console.error("Problème")
        }
      });
    } catch (e) {
      console.error(e)
    }

  }
}

module.exports = task
