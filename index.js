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
});

app.get('/animated-svg', (req, res) => {
  res.set({
  'Content-Type': 'image/svg+xml'
});
var duration = 5;
if(req.query.duration)
  duration = req.query.duration;
var color = "#9e4a44";
if(req.query.color)
  color = req.query.color;
var text = "Dynamic Badges/SVG Animated Text";
if(req.query.text)
  text = req.query.text;
var repeatCount = "indefinite";
if(req.query.repeatCount)
  repeatCount = req.query.repeatCount;
var font = "Montserrat";
if(req.query.font)
  font = req.query.font;
var fontSize = 26;
if(req.query.fontSize)
  fontSize = req.query.fontSize;
  res.send(
    `
    <svg width="100%" height="100%" viewBox="30 -50 600 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
 <path id="path">
		<animate attributeName="d" from="m0,110 h0" to="m0,110 h1100" dur="${duration}s" begin="0s" repeatCount="${repeatCount}"/>
	</path>
	<text font-size="${fontSize}" font-family="${font}" fill='${color}'>
		<textPath xlink:href="#path">${text}</textPath>
	</text>
</svg>
`
  );
});

app.get('/*', (req, res) => {
  res.redirect("https://github.com/Jaysmito101/dynamic-badges");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
});