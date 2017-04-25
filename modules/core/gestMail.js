const settings = require('./settings')
const nodemailer = require('nodemailer')
const gestMysql = require('./gestMysql')
const smtpTransport = require('nodemailer-smtp-transport')
const path = require('path')
const fs = require('fs')

class gestMail extends settings {
  constructor() {
    super()
    this.idCommande = ""
  }

  async sendMail(nameHTML, to, subject, variables = []) {
    try {
      //definition des variables
      let rows = await super.getSettingsById("mail")
      let html = await this.getHTML(nameHTML)
      //On remplace les settings
      html = this.replaceHTML(variables, html)
      //Création du smtp
      let transporter = nodemailer.createTransport(smtpTransport ({
        host: super.getName(rows, "smtp").value,
        secureConnection: true,
        port: parseInt(super.getName(rows, "port").value),
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: super.getName(rows, "user").value,
          pass: super.getName(rows, "pass").value
        }
      }))

      //definition des options
      let mailOptions = {
        from: '"easering.com" <'+super.getName(rows, "user").value+'>',
        to: to,
        subject: subject,
        html: html
      }


      //Envoie du mail
      return transporter.sendMail(mailOptions, (error, info) => {
        if(error) return console.log(error)
        new gestMysql("easeringapi").sendRequest("INSERT INTO `email` (`sendEmail`, `subject`, `id_commande`, `html`, `returnSendEmail`, `date`) VALUES (?, ?, ?, ?, ?, ?);", to, subject, this.idCommande, nameHTML, JSON.stringify(info), new Date().toISOString().slice(0, 19).replace('T', ' '))
        console.log(info)
      })
    } catch(e) {
      console.error(e)
    }
  }

  getHTML(nameHTML) {
    return new Promise(function(resolve, reject) {
      if(nameHTML.substr(nameHTML.length - 5, nameHTML.length) == ".html") {
        let filePath = path.join("./modules/mailHTML/"+nameHTML)
        fs.readFile(filePath, 'utf8', function (err, data) {
          if(err) reject(Error(err))
          resolve(data)
        })
      } else {
        resolve(nameHTML)
      }
    })
  }

  getFileHTML() {
    return new Promise(function(resolve, reject) {
      let folderPath = path.join("./modules/mailHTML/")
      fs.readdir(folderPath, function (err, items) {
        if(err) reject(Error(err))
        resolve(items)
      })
    })

  }

  replaceHTML(variable, html) {
    for (let i = 0; i<variable.length;i++) {
      html = html.replace(new RegExp(variable[i].to, 'g'), variable[i].in)
      if(variable[i].to == "%nCommande%") {
        this.idCommande = variable[i].in
      }
    }
    return html
  }

  async getRecapMail() {
    return await new gestMysql("easeringapi").sendRequest("SELECT * FROM email ORDER BY id DESC")
  }
}

module.exports = gestMail;
