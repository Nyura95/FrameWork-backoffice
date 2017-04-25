module.exports = function(app) {
  app.get('/', (req, res) => {
    let fail = false
    if(!res.checkedToken(req.cookies.token)) {
      if(req.cookies.token) {
        fail = req.cookies.token
      }

      res.locals.navbar = [ {href:"/", affichage:"Page de connexion", active:1, icon:"sign-in"}]
      var locals = {
        meta: {
          title: 'Connexion',
          description: 'API easering - Demande de connexion à l\'API',
          path: false
        },
        fail:fail
      }
      return res.render('connect/connect', locals)
    }
    return res.redirect('/principal')
  })

  app.post('/', (req, res) => {
    let heure = (60 * 1000) * 60
    let profiles = res.checkIfLogin(req.body.inputUser, req.body.inputPsw)
    if(profiles.user) {
      res.cookie('token', res.getToken(profiles), { maxAge: heure })
      return res.redirect('back')
    } else if(profiles){
      res.cookie('token', profiles, { maxAge: heure })
      return res.redirect('back')
    }
  })

  app.get('/deco', (req, res) => {
    res.clearCookie('token')
    res.redirect("/")
  })
};
