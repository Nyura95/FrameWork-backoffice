const gestMysql = require("./gestMysql")
const gestMail = require("./gestMail")
const search = require('./search')
class form extends search{
  constructor(title, method, action) {
    super()
    this.nbName = 1
    this.form = {title:title, method:method, action:action, content:[]}
  }

  getForm() {
    this.form.nb = this.nbName
    return this.form
  }

  setInput(label="Default", name="name", type="text", icon="inbox", operator=false, value="") {
    this.form.content.push({label:label, type:type, icon:icon, name:name, operator:operator, value:value})
    this.nbName++
  }

  async setSelect(label="Default", name="name", icon="inbox", placeholder="", choose=[], value="") {
    if(typeof choose == "string") {
      if(choose.indexOf("/") === -1){
        //Ajouter les conditions SELECT ET FROM au minimum
        var rows = await new gestMysql().sendRequest(choose)
        var stringChoose = choose.substr(choose.indexOf("SELECT") + 6, choose.indexOf("FROM") - 6)
        stringChoose = stringChoose.split(",")
        choose = new Array()
        for (let i = 0; i < rows.length; i++) {
          var affichage = ""
          for (let y = 0; y < stringChoose.length; y++) {
            affichage += rows[i][stringChoose[y].replace(new RegExp(" ", 'g'), "")] + " - "
          }
          choose.push({value:rows[i][stringChoose[0].replace(new RegExp(" ", 'g'), "")], affichage:affichage.substr(0, affichage.length - 3)})
        }
      } else {
        let fileFolder = await new gestMail().getFileHTML()
        var choose = new Array()
        for (let i = 0; i < fileFolder.length; i++) {
          choose.push({value:fileFolder[i].replace(new RegExp(" ", 'g'), ""), affichage:fileFolder[i].replace(new RegExp(" ", 'g'), "")})
        }
      }
    } else {
      let tmp = choose
      choose = new Array()
      for (let i = 0; i < tmp.length; i++) {
        tmp[i]
        choose.push({value:tmp[i], affichage:tmp[i]})
      }
    }
    this.form.content.push({label:label, type:"select", icon:icon, placeholder:placeholder, name:name, choose:choose})
    this.nbName++
  }

  setAera(label="Default", name='name', icon="inbox", placeholder = "", value="") {
    this.form.content.push({label:label, type:"textarea", icon:icon, name:name, placeholder:placeholder})
    this.nbName++
  }
}

module.exports = form;
