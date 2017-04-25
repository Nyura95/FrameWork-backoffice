const ejs = require('./ejs')

class search extends ejs{
  /*
  Utilisation

  paramValue : Les parametres de la valeur rechercher en object (Mettre le req.body du formulaire)
  colonneName : Non obligatoire SI paramValue a comme nom de clef les champs

  (Astuce : Dans le formualaire, nommé les inputs du nom des champs rechercher et envoyer req.body directement dans paramValue)
  */

  constructor() {
    super()
  }

  setRequest(rows) {
    this.rows = rows
  }

  seek(paramValue, colonneName) {
    if(colonneName) {
      var paramSeek = colonneName
    } else {
      var paramSeek = Object.keys(paramValue)
    }

    let trueValue = {}
    //On enlever les valeurs vides pour plus d'optimisation
    let operator = {}
    for (let i = 0; i < paramSeek.length; i++) {
      if(paramValue[paramSeek[i]] != "") {
        if(paramSeek[i].indexOf('operator-') != -1) operator[paramSeek[i].substring(9, paramSeek[i].length)] = paramValue[paramSeek[i]]
        trueValue[paramSeek[i]] = paramValue[paramSeek[i]]
      }
    }

    //On recupère les keys
    paramSeek = Object.keys(trueValue)

    let rows = JSON.parse(JSON.stringify(this.rows))

    for (let i = 0; i < paramSeek.length; i++) {
      if(paramSeek[i].substring(0, 9) == "operator-") continue
      for (let y = 0; y < rows.length; y++) {
        let check = false
        let tmp = this.see(rows[y], paramSeek[i])
        let defaultOperator = "="
        if(Array.isArray(tmp)) {
          for (let u = 0; u < tmp.length; u++) {
            if (operator[paramSeek[i]]) defaultOperator = operator[paramSeek[i]]
            if(super.resolution(tmp[u], paramValue[paramSeek[i]], defaultOperator)) {
              check = true
            }
          }
        } else {
          if (operator[paramSeek[i]]) defaultOperator = operator[paramSeek[i]]
          if(super.resolution(tmp, paramValue[paramSeek[i]], defaultOperator)) {
            check = true
          }
        }
        if(!check) {
          rows.splice(y, 1)
          y--
        }
      }
    }
    return rows
  }
  see(tab, value) {
    tab = JSON.parse(JSON.stringify(tab))
    if(value.indexOf('.') != -1) {
      value = value.split('.')
    } else {
      value = [value]
    }
    if(Array.isArray(tab)) {
      for (let i = 0; i < tab.length; i++) {
        for (let y = 0; y < value.length; y++) {
          tab[i] = tab[i][value[y]]
        }
      }
    } else {
      if(Array.isArray(tab[value[0]])) {
        for (let i = 0; i < tab[value[0]].length; i++) {
          for (let y = 1; y < value.length; y++) {
            tab[value[0]][i] = tab[value[0]][i][value[y]]
          }
        }
        return tab[value[0]]
      }
      for (let y = 0; y < value.length; y++) {
        tab = tab[value[y]]
      }
      return tab
    }

    return tab
  }

}

module.exports = search;
