module.exports = function(app) {
  app.get('/principal', async (req, res) => {
    var locals = {
      meta: {
        title: 'Page principal',
        description: 'API easering - Page principal - EASERING',
        newMsg:0,
        newAlert:0,
        token:req.cookies.token
      },
      newQuest:0,
      newAchat:0,
      newRecla:0
    }
    res.render('index/index', locals)
  })
};
