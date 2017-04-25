class retour{
  constructor(titre, color) {
    this.retour = {titre:titre, color:color, content:[]}
  }

  setText(text) {
    this.retour.content.push({text:text})
  }

  getRetour() {
    return this.retour
  }
}

module.exports = retour;
