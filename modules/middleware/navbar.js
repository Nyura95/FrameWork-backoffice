//navbar
let rows = [
  { id: 0, affichage: 'Trajet', ref: '/principal', icon: 'dashboard', autorisation: 0 },
  { id: 1, affichage: 'Commande', ref: '/commande', icon: 'tasks', autorisation: 0 },
  { id: 2, affichage: 'Commande2', ref: '/commande2', icon: 'tasks', autorisation: 0 }
]

let path = true

console.log("navbar load ...")

module.exports = function (req, res, next) {
  //define active path
  for (let i = 0; i < rows.length; i++) {
    if(rows[i].ref.split('/')[1] == req.path.split('/')[1]) {
      rows[i].active = 1
    } else {
      rows[i].active = 0
    }
  }
  res.locals.navbar = rows

  if(path) {
    url = req.path
    var infoUrl = new Array()
    url = url.split('/')

    for (let i = 0; i < url.length; i++) {
      infoUrl.push({affichage:url[i], ref:url[i]})
    }

    for (let i = 0; i < rows.length; i++) {
      for (let y = 0; y < infoUrl.length; y++) {
        if(infoUrl[y].affichage == rows[i].id_statut) {
          infoUrl[y].affichage = rows[i].statutCourt
        }
      }
    }
    res.locals.path = infoUrl
  } else {
    res.locals.path = path
  }
  next()
};
