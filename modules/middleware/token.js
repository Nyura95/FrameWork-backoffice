const jwt = require("jsonwebtoken")

var jwtSecret = "clefSecret"


var utilisateur = [{user:"admin", psw:"admin"}]

var messageAlet = {success: "Le mot de passe de ce compte est érroné !", danger: "Compte non reconnu !"}

var pageHorsSecurite = ["/"]


module.exports = function (req, res, next) {
  var render = res.render;

  res.getToken = function (profile) {
    return jwt.sign(profile, jwtSecret, {expiresIn : '1h'})
  }

  res.checkedToken = function (token) {
		try{
			var decoded = jwt.verify(token, jwtSecret)
			return decoded
		}catch(err){
			return null
		}
	}

  res.checkIfLogin = function (user, psw) {
    let compteFind = "danger"
    for (let i = 0; i < utilisateur.length; i++) {
      if(user === utilisateur[i].user) {
        compteFind = "success"
        if(psw === utilisateur[i].psw) {
          return utilisateur[i]
        }
      }
    }
    return {alert:compteFind, message:messageAlet[compteFind]}
  }

  //Pour toutes les pages qui on été mise hors sécurité
  for (let i = 0; i < pageHorsSecurite.length; i++) {
    //Si ce n'est pas une page hs
    if(req.path[0] != pageHorsSecurite[i]) {
      //On test le token
      if(!res.checkedToken(req.cookies.token)) {
        //Si il n'est pas bon, on le renvoie a la connexion
        return res.redirect('/')
      }
    }
  }

  next()
};
