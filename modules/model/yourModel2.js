const model = require('../core/model')

let model2 = new model(2)
model2.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>", "center")

model2.setCorps({
  text:"<b><%= nameColonne %></b> : <%= value %>",
  rows:["infoClient.nom", "infoClient.prenom", "infoClient.adresse", "infoClient.ville", "infoClient.postal", "infoClient.email", "infoClient.tel"],
  type:"list",
  position:"center"
})

model2.setFooter({text:"Modifier cette commande", ref:"#", type:"arrow"})

module.exports = model2;
