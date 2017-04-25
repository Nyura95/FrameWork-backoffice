const yourModel = require("../modules/model/yourModel2")
const form = require('../modules/core/form')
module.exports = function(app) {
  let rows =
  [
    {
      id_commande:"FR-DFFRF656T",
      id_status:3,
      status:"En cours de livraison",
      infoClient: {
        prenom:"Alexis",
        nom:"Courapied",
        adresse:"59 allée du parc",
        ville:"Domont",
        postal:"95330",
        email:"alexis.courapied@aphp.fr",
        tel:"0629418968"
      },
      infoCommande: {
        total:22,
        transport:12,
        nbProduit:3
      }
    },
    {
      id_commande:"FR-DFFRF656T",
      id_status:3,
      status:"En cours de livraison",
      infoClient: {
        prenom:"Alexis",
        nom:"Courapied",
        adresse:"59 allée du parc",
        ville:"Domont",
        postal:"95330",
        email:"alexis.courapied@aphp.fr",
        tel:"0629418968"
      },
      infoCommande: {
        total:22,
        transport:12,
        nbProduit:3
      }
    }
  ]

  app.get('/commande2', async (req, res) => {
    yourModel.setRequete(rows, 0, 50)

    var locals = {
      meta: {
        title: 'Commande',
        description: 'Commande',
        newMsg:0,
        newAlert:0,
        token:req.cookies.token
      },
      model: yourModel.getModel()
    }
    res.render('commande/index', locals)
  })
};
