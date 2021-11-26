const express = require("express");
const app = express();
const Database = require("@replit/database");


const db = new Database()



app.get('/api/views', (req, res) => {
  var key = "view-" + encodeURIComponent(req.query.id);
  db.get(key).then(value => {
    var val = 0;
    if (value != undefined && value != null) {
      val = value;
    }
    var col = "green";
    var st = "for-the-badge";
    if (req.query.color)
      col = req.query.color;
    if (req.query.style)
      st = req.query.style;


    var output = {
      "schemaVersion": 1,
      "label": "Views",
      "message": `${val}`,
      "color": col,
      "style": st,
      "cacheSeconds": 1
    };
    res.json(output);
  });
});

app.get('/views', (req, res) => {

  var key = "view-" + encodeURIComponent(req.query.id);
  db.get(key).then(value => {
    var val = 0;
    if (value == undefined || value == null) {
      db.set(key, 0).then(() => { });
    }
    else {
      val = value + 1;
    }

    db.set(key, val).then(() => {
      var col = "green";
      var st = "for-the-badge";
      if (req.query.color)
        col = req.query.color;
      if (req.query.style)
        st = req.query.style;

      res.redirect("https://img.shields.io/endpoint?url=" + encodeURIComponent(`https://dynamic-badges.maxalpha.repl.co/api/views?id=${req.query.id}&color=${col}&style=${st}`));

    });
  });
})

app.get('/*', (req, res) => {
  res.redirect("https://github.com/Jaysmito101/dynamic-badges");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
});