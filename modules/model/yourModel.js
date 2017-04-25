const model = require('../core/model')

let model1 = new model(1)
model1.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>", ["L'état de la commande est <b><%= status %></b>", "<%= status %>"])

model1.setCorps({
  text:"<b><%= nameColonne %></b> : <%= value %>",
  rows:["infoClient.nom", "infoClient.prenom", "infoClient.adresse", "infoClient.ville", "infoClient.postal", "infoClient.email", "infoClient.tel"],
  type:"list",
  position:"left",
  title:"Information client :"
}, {
  text:["<b>Total de la commande</b> : <%= infoCommande.total %>€", "<b>Coùt de transporteur payé</b> : <%= infoCommande.transport %>€", "<b>Nombre de produit</b> : <%= infoCommande.nbProduit %>"],
  type:"checklist",
  position:"left",
  title:"Information commande :",
  subtitle:"<small>Pour voir le panier, aller dans plus d'information</small>"
})
model1.setFooter(
  {text:"Plus d'information", color:"primary", ref:"/commande/<%= id_commande %>"},
  {text:"Confirmé la commande", color:"success", ref:"/commande/confirme/<%= id_commande %>", condition:"<%= id_status %> = 2"}
)

module.exports = model1;
