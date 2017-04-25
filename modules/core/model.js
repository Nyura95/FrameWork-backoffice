const ejs = require('./ejs')

class model extends ejs{
  /*
  Utilisation de la class
  Nombre de carte afficher au constructor de la classe


  Variable global :
    index : renvoie l'index de la table
    nameColonne : Revoie au nom de la colonne juste avant ou juste apres elle

  HEADER
    //Title, subtitle, position (position par defaut : left)
    large.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>", "L'état de la commande est <b><%= statut %></b>")
    large.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>", "center")
    large.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>")
    // pour le responsive
    large.setHeader("Commande N°<%= index + 1 %>", "<%= id_commande %>", ["L'état de la commande est <b><%= statut %></b>", "<%= statut %>"])
  footer
    Si envoie par text, vous pouvez en mettre une infinité. Il se mettrons côte à côte. Nommé la derniere ligne par "center", "left" ou "right" pour set la position
      large.setCorps("<b><%= nameColonne %></b> : <%= infoClient.name %>",)
      large.setCorps("<b><%= nameColonne %></b> : <%= infoClient.name %>", "<b><%= nameColonne %></b> : <%= infoClient.name %>", "<b><%= nameColonne %></b> : <%= infoClient.name %>", "center")
    Si envoie par object
    variable obligatoire :
      text : corresponds au text afficher
      row : corresponds au variable du texte
    variable optionnel
      type : "list" ou "checklist"
      position : "left", "center", "right"
      title : cooreponds au titre de la div
      subtitle : cooreponds au sous titre de la div

      Deux forme possible :
        // On envoie un text unique, répéter a chaque rows
          large.setCorps({
            text:"<b><%= nameColonne %></b> : <%= value %>",
            rows:["infoClient.name", "id_commande"],
            type:"list",
            position:"left",
            title:"<% infoClient.name %>",
            subtitle:"Détail client :"
          })

          // Si besoin de plusieurs variable dans le text
            large.setCorps({
              text:"<b><%= nameColonne %></b> : <%= value %> : <%= value %>",
              rows:[["id_commande", "infoClient.name"]],
              type:"list",
              position:"left",
              title:"<%= infoClient.name %>",
              subtitle:"Détail client :"
            })
        // On envoie un array de text qui serra unique
          large.setCorps({
            text:["<b><%= nameColonne %></b> : <%= id_commande %>", "<b><%= nameColonne %></b> : <%= id_commande %>"],
            type:"list",
            position:"left",
            title:"<%= infoClient.name %>",
            subtitle:"Détail client :"
          })
  HEADER
    //Envoie de button
    //Text : le text afficher, color: couleur afficher, ref: href du button, condition: la condition d'affichage
      large.setFooter({text:"Plus d'information", color:"primary", ref:"/commande/recherche/<%= id_commande %>", condition:"<%= id_statut %> > 2"})
    //Envoie de text
    //Variable infini, le dernier set la position
      large.setFooter("<%= id_commande %>", "<%= infoClient.name %>", "right")

  */

  //FULL / COLUMN
  constructor(nbColumns=1) {
    super()
    this.header = {title:"", subtitle:"", position:""}
    this.corps = new Array()
    this.footer = new Array()
    this.nbColumns = nbColumns
  }

  //Rows : Requete, start : Debut, end : fin
  setRequest(rows, start = 0, end = 50) {
    super.setRequete(rows)
    this.rows = rows
    //Rows limite
    this.start = start
    this.end = end
  }

  setHeader(title="", subtitle="", position="") {
    //Pour des demandes d'asynchrone on envoie les paramettres en décaler
    this.header = {title:title, subtitle:subtitle, position:position}
  }

  getHeader(title="", subtitle="", position="left") {
    //Si on reçoit rien, on revoit vide. Le model n'affichera rien
    if(!title && !subtitle && !position) return []

    //Début du HEADER, la variable retourné est un tableau dont le nombre d'entré correspondra au nombre de ligne de la requête
    let header = new Array()
    for (let i = this.start; i < this.rows.length; i++) {
      //Si nous sommes au dessus de la valeur maximal
      if(i>this.end) {
        i=this.rows.length + 1
      }
      //Si la position n'est pas une variable de position, l'utilisateur veux une subtitle a droite
      if(position != "left" && position != "center" && position != "right") {
        if(Array.isArray(position)) {
          //Array temporaire, il va stocker les deux varriables envoyé par l'utilisateur
          var tmpArray = new Array()
          //Pas au dessus de deux variables. Plus on ne traitera pas
          for (let y = 0; y < 2; y++) {
            let tmp = super.changeParams(i, position[y])
            tmpArray.push(tmp[0])
          }
        }

        //Méthode a modifier, pour une futur optimisation
        if(tmpArray) {
          let tmp = super.changeParams(i, title, subtitle)
          if(tmpArray.length > 1) {
            header.push({title:tmp[0], subtitle:tmp[1], subtitleLeft:tmpArray[0], subtitleLeftRes:tmpArray[1]})
          } else {
            header.push({title:tmp[0], subtitle:tmp[1], subtitleLeft:tmpArray[0]})
          }
        } else {
          let tmp = super.changeParams(i, title, subtitle, position)
          header.push({title:tmp[0], subtitle:tmp[1], subtitleLeft:tmp[2]})
        }
      } else {
        //On parse les variables possible dans le texte
        let tmp = super.changeParams(i, title, subtitle)
        //On l'ajoute a l'header
        header.push({title:tmp[0], subtitle:tmp[1], position:position})
      }

    }
    //Retourne la table parser
    return header
  }

  setCorps(...params) {
    this.corps = params
  }

  getCorps(params) {
    //Si l'utilisateur nous envoie rien, on retourne une table vide (le model n'affichera rien)
    if(params.length == 0) return []

    let corps = new Array()
    //position de base
    let position = "left"
    let type = "list"

    //Pour chaque ligne
    for (let i = this.start; i < this.rows.length; i++) {
      //Si nous sommes au dessus de la valeur maximal
      if(i>this.end) {
        i=this.rows.length + 1
      }

      //Creation du tableaux temporaire
      let tmpArray = new Array()
      //Petit test a prévoir ICI
      for (let y = 0; y < params.length; y++) {
        //Valeurs de base
        let title = ""
        let subtitle = ""
        //Si la variables est un object
        if(typeof params[y] == "object" && !Array.isArray(params[y])) {

          //On set les parametres et on parse les textes
          if(params[y].position) position = params[y].position
          if(params[y].type) type = params[y].type
          if(params[y].title) title = super.changeParams(i, params[y].title)
          if(params[y].subtitle) subtitle = super.changeParams(i, params[y].subtitle)
          //Si il y a bien le minimum demander
          if(params[y].text && params[y].rows) {
            //Creation de l'array des parametres
            let paramArray = new Array()
            //Pour chaque ligne
            for (var t = 0; t < params[y].rows.length; t++) {
              //plusieurs parametres
              if(Array.isArray(params[y].rows[t])) {
                let tmp = params[y].text
                for (var r = 0; r < params[y].rows[t].length; r++) {
                  //parametre par parametre
                  params[y].rows[t][r]
                  tmp = tmp.replace("value", params[y].rows[t][r])
                }
                tmp = super.changeParams(i, tmp)
                paramArray.push(tmp[0])
              }else {
                //il n'y a qu'un seul parametre
                let tmp = params[y].text.replace("value", params[y].rows[t])
                tmp = super.changeParams(i, tmp)
                paramArray.push(tmp[0])
              }
            }
            tmpArray.push({rows:paramArray, type:type, position:position, title:title, subtitle:subtitle})
            //Si uniquement le texte est demander
          } else if(params[y].text) {
            //Si c'est un tableaux, on parse one by one
            if(Array.isArray(params[y].text)){
              let saveTMP = new Array()
              for (let t = 0; t < params[y].text.length; t++) {
                let tmp = super.changeParams(i, params[y].text[t])
                saveTMP.push(tmp[0])
              }
              tmpArray.push({rows:saveTMP, position:position, type:type, title:title, subtitle:subtitle})
            } else {
              //Si c'est un object
              if(typeof params[y].text == "object") {
                //On regarde les keys
                let keys = Object.keys(params[y].text)
                //On parcours
                for (var a = 0; a < keys.length; a++) {
                  let tmp = super.changeParams(i, params[y].text[keys[a]])
                  //On ajoute les variables parse
                  tmpArray.push({rows:tmp[0]})
                }
              } else {
                //On ajoute juste le texte
                let tmp = super.changeParams(i, params[y].text)
                tmpArray.push({rows:tmp[0]})
              }
            }
          } else {
            //Nous avons besoin au minimum d'un texte
            console.error("Corps need a object with params text min.")
          }
          //Si la valeurs envoyé est un string
        }else if(typeof params[y] == "string") {
          //On look si la derniere variable est la position
          if(params[params.length - 1] == "left" || params[params.length - 1] == "center" || params[params.length - 1] == "right") {
            position = params[params.length - 1]
            //Si oui, on modifie la variable global et on enleve la derniere ligne
            params.splice(params.length - 1, 1)
          }
          //On ajoute les variales envoyé one by one
          let tmp = super.changeParams(i, params[y])
          tmpArray.push({rows:[tmp[0]], position:position, type:type})
        } else {
          console.error("Corps need a object or a string")
        }
      }
      //On retourne le tout
      corps.push(tmpArray)
    }
    return corps
  }

  setFooter(...params) {
    this.footer = params
  }

  getFooter(params) {
    //Si l'utilisateur nous a rien envoyé, on renvoie vide
    if(params.length == 0) return []

    //Début du FOOTER
    let footer = new Array()

    if(params.length > 0) {
      //Si l'utilisateur nous envoie un object, on comprends qu'il veut des boutons
      if(typeof params[0] == "object") {
        //Pour chaque lignes dans la requete
        for (let i = this.start; i < this.rows.length; i++) {
          //Si nous sommes au dessus de la valeur maximal
          if(i>this.end) {
            i=this.rows.length + 1
          }
          //Array temporaire
          let tmpArray = new Array()
          //Pour chaque bouton demandé
          for (let y = 0; y < params.length; y++) {

            //Si la condition n'est pas envoyé, par defaut TRUE
            if(!params[y].condition) {
              params[y].condition = "true"
            }
            //Parse des variables des boutons
            let tmp = super.changeParams(i, params[y].text, params[y].color, params[y].ref, params[y].condition)

            if(params[y].type) {
              //Si un type est envoyé
              tmpArray.push({text:tmp[0], color:tmp[1], ref:tmp[2], condition:super.getEqual(tmp[3]), type:params[y].type})
            } else {
              //On envoie les données traité dans la table temporaire
              tmpArray.push({text:tmp[0], color:tmp[1], ref:tmp[2], condition:super.getEqual(tmp[3])})
            }
          }
          //On envoie les données dans le footer
          footer.push(tmpArray)
        }
        //Si l'utilisateur nous donne une variable texte
      } else if(typeof params[0] == "string") {
        //Position par defaut
        let position = "left"
        for (let i = this.start; i < this.rows.length; i++) {
          //Si nous sommes au dessus de la valeur maximal
          if(i>this.end) {
            i=this.rows.length + 1
          }
          //Création de la table temporaire
          let tmpArray = new Array()
          //Pour chaque paramettres rentré
          for (let y = 0; y < params.length; y++) {
            // Si la derniere variable est une variable de position
            if(params[params.length - 1] == "left" || params[params.length - 1] == "center" || params[params.length - 1] == "right") {
              //On set dirrectement la position
              position = params[params.length - 1]
              //et On la retire des paramettres
              params.splice(params.length - 1, 1)
            }
          }
          for (let y = 0; y < params.length; y++) {
            //On parse les données
            let tmp = super.changeParams(i, params[y])
            // On envoie dans la table tmp avec la positon voulu
            tmpArray.push({title:tmp[0], position:position})
          }


          //On envoie le tout dans la table footer
          footer.push(tmpArray)
        }
      }
    }
    return footer
  }

  getModel() {
    return {rows:this.rows, nbColumns:this.nbColumns, start:this.start, end:this.end, header:this.getHeader(this.header.title, this.header.subtitle, this.header.position), corps:this.getCorps(this.corps), footer:this.getFooter(this.footer)}
  }
}

module.exports = model;
