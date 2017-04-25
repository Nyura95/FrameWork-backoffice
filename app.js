//Node_modules
const express = require("express")
const bodyparser = require("body-parser")
const busboy = require('connect-busboy')
const fs = require("fs")
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const jwt = require("./modules/middleware/token")
const nav = require("./modules/middleware/navbar")
const gestMysql = require("./modules/core/gestMysql")
const https = require("https")


//-------

//class
//-------


class Application {
  constructor() {
    this.app = express()
    this.app.use(busboy())
    this.app.use(bodyparser.json())
    this.app.use(bodyparser.urlencoded({
        extended: true
    }))
    this.app.use(cookieParser("secret"))
    this.app.use(function(req, res, next){
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization')
			res.setHeader('Access-Control-Allow-Methods', '*')
			res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time')
			res.setHeader('Access-Control-Max-Age', '1000')
			next()
		})


    //gestion token
    this.app.use(jwt)
    //gestion navbar
    this.app.use(nav)

    //Definition des librairies pour l'API
    this.app.use('/css', express.static(__dirname + '/views/public/css/'))
    this.app.use('/lib', express.static(__dirname + '/views/public/lib/'))
    this.app.use('/js', express.static(__dirname + '/views/public/js/'))
    this.app.use('model', express.static(__dirname + '/views/model/'))

    //Gestion Model/View
    this.app.set('view engine', 'ejs')
    this.app.use(expressLayouts)

    //Initialisation des routes
    this.initallRouters("./routes")

    this.app.listen(3001, function() {
		 console.log('app listening on port 3001!')
   })
  }

  initallRouters(path) {
    fs.readdir(path, (err, files) => {
      files.forEach(file => {
        if(file.indexOf(".js") != -1){
          require(path+"/"+file)(this.app)
          console.log("load route ... "+file)
        } else {
          if(file != ".DS_Store") this.initallRouters(path+"/"+file)
        }
      })
    })
  }

}

new Application()
