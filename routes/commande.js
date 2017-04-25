const yourModel = require("../modules/model/yourModel")
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
    }
  ]

  app.get('/commande', async (req, res) => {
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

  app.get('/commande/recherche', async (req, res) => {
    //Création du formulaire
    var newForm = new form("Recherche d'une commande", "POST", "/commande")
    newForm.setInput("Rechercher par ID", "id_commande", "text", "id-card-o", true)
    newForm.setInput("Rechercher par prix", "infoCommande.total", "text", "dollar", true)
    newForm.setInput("Rechercher par token Paypal", "tokenPaypal", "text", "cc-paypal", true)
    newForm.setInput("Rechercher par téléphone", "infoClient.tel", "text", "phone", true)
    newForm.setInput("Rechercher par nom", "infoClient.name", "text", "facebook", true)
    newForm.setInput("Rechercher par ville", "infoClient.ville", "text", "address-book-o", true)
    newForm.setInput("Rechercher par code postal", "infoClient.postal", "text", "address-card", true)
    await newForm.setSelect("Rechercher par ID produit", "panier.produit.id_produit", "puzzle-piece", "ID produit", "SELECT id_produit, name FROM `produit`")

    var locals = {
      meta: {
        title: 'Recherche d\'une commande',
        description: 'API easering - Recherche de commande - EASERING',
        token:req.cookies.token
      },
      form: newForm.getForm()
    }
    res.render('commande/recherche', locals)
  })

  app.get('/commande/:commande', async (req, res) => {
    //check in BDD with this params "req.params.commande"
    var locals = {
      meta: {
        title: 'Information détaillé d\'une commande',
        description: 'API - Information détaillé d\'une commande',
        token:req.cookies.token
      },
      information: rows
    }
    res.render('model/information', locals)
  })

  app.post('/commande', async (req, res) => {

    let newForm = new form()
    newForm.setRequete(rows)
    let commande = newForm.seek(req.body)
    yourModel.setRequete(commande, 0, 1)

    var locals = {
      meta: {
        title: 'Résulat d\'une recherche',
        description: 'API easering - Tries des commandes - EASERING',
        token:req.cookies.token
      },
      model:yourModel.getModel()
    }
    res.render('commande/index', locals)
  })


};
