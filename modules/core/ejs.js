class ejs {
  constructor() {
  }

  setRequete(rows) {
    this.rows = rows
  }

  getParams(str) {
    let save = str
    let value = new Array()
    try {
      if(save) {
        for (let i = 1; i < save.split('<%=').length; i++) {
          value.push({value:str.substring(str.indexOf("<%=") + 3, str.indexOf("%>")).replace(new RegExp(" ", 'g'), ""), valueFull:str.substring(str.indexOf("<%="), str.indexOf("%>") + 2), base:save})
          str = str.replace(str.substring(str.indexOf("<%="), str.indexOf("%>") + 2), "")
        }
        return value
      } else {
        return ""
      }
    } catch (e) {
      console.error(e)
    }
  }

  resolution(param1, param2, condition) {
    switch(condition) {
      case "+":
        if(typeof param1 == "string") return parseInt(param1) + parseInt(param2)
        return param1 + param2
      case "-":
        if(typeof param1 == "string") return parseInt(param1) - parseInt(param2)
        return param1 - param2
      case "*":
        if(typeof param1 == "string") return parseInt(param1) * parseInt(param2)
        return param1 * param2
      case "/":
        if(typeof param1 == "string") return parseInt(param1) / parseInt(param2)
        return param1 / param2
      case "=":
        if(parseInt(param1)) {
          if(parseInt(param1) === parseInt(param2)) return true
          return false
        }
        if(param1 == param2) return true
        return false
      case "!=":
        if(param1 != param2) return true
        return false
      case ">":
        if(typeof param1 == "string") {
          if(parseInt(param1) > parseInt(param2)) return true
          return false
        }
        if(param1 > param2) return true
        return false
      case ">=":
        if(typeof param1 == "string") {
          if(parseInt(param1) >= parseInt(param2)) return true
          return false
        }
        if(param1 >= param2) return true
        return false
      case "<":
        if(typeof param1 == "string") {
          if(parseInt(param1) < parseInt(param2)) return true
          return false
        }
        if(param1 < param2) return true
        return false
      case "<=":
        if(typeof param1 == "string") {
          if(parseInt(param1) <= parseInt(param2)) return true
          return false
        }
        if(param1 <= param2) return true
        return false
      default :
        return false
    }
  }


  getEqual(str) {
    let array = ["+", "-", "/", "*", ">", "<", "<=", ">=", "="]
    try {
      for (let i = 0; i < array.length; i++) {
        if(str.indexOf(array[i]) != -1)  return this.resolution(str.split(array[i])[0].replace(new RegExp(" ", 'g'), ""), str.split(array[i])[1].replace(new RegExp(" ", 'g'), ""), array[i])
      }
    } catch (e) {
      console.error("getEqual need a string, str send : " + str)
      console.error(e)
    }
    return str
  }

  exec(indexRow, params) {
    let valueString = this.getParams(params)
    try {
      for (let i = 0; i < valueString.length; i++) {
        //variables globales
        if(valueString[i].value.indexOf("index") != -1) {
          valueString[i].value = this.getEqual((valueString[i].value).replace("index", indexRow))
          params = params.replace(valueString[i].valueFull, valueString[i].value)
          continue
        }
        if(valueString[i].value.indexOf("nameColonne") != -1) {
          //Si on trouve rien d'autre, on mets la valeurs de base
          let colonne = valueString[i].value
          if(valueString[i + 1]){
            colonne = valueString[i + 1].value
          } else if(valueString[i - 1]) {
            colonne = valueString[i - 1].value
          }
          //Si l'utilisateur donne une variable avec un object, on recup le dernier nom
          if(colonne.indexOf('.') != -1) colonne = colonne.split('.')[colonne.split('.').length - 1]
          valueString[i].value = this.getEqual((valueString[i].value).replace("nameColonne", colonne))
          params = params.replace(valueString[i].valueFull, valueString[i].value)
          continue
        }
        //On for les paramatres
        let valueStringParams = valueString[i].value.split('.')
        let tmp = this.rows[indexRow]
        // ICI ON REMPLACE PAR LES BONNES VALEURS
        for (var y = 0; y < valueStringParams.length; y++) {

          tmp = tmp[valueStringParams[y]]
          if(tmp === undefined) tmp = "undefined"
        }

        //Les dates sont consideré comme des objects...
        //2017-04-09T20:14:17.000Z
        let convertDate = function(date) {
          //toLocaleTimeString()
          date = new Date(tmp)

          if(date == "Invalid Date") return "{object}"
          return date.toLocaleDateString("en-GB")+" à "+date.toLocaleTimeString()
        }

        if(typeof tmp == "object") tmp = convertDate(tmp)
        if(Array.isArray(tmp)) tmp = "{Array}"
        //on replace la valeur en entier
        params = params.replace(valueString[i].valueFull, tmp)
      }
    } catch (e) {
      return ""
      console.error(e)
    }
    return params
  }

  //Params class
  changeParams(indexRow, ...params) {
    try {
      for (let i = 0; i < params.length; i++) {
        if(Array.isArray(params[i])) {
          console.log(params[i])
          for (let y = 0; y < params[i].length; y++) {
            //params[i][y] = this.exec(indexRow, params[i][y])
          }
        } else {
          params[i] = this.exec(indexRow, params[i])
        }
        //On récupère les parametres du string
      }
      return params
    } catch (e) {
      console.error(e)
      return ""
    }

  }
}

module.exports = ejs;
