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
  if (req.query.duration)
    duration = req.query.duration;
  var color = "#9e4a44";
  if (req.query.color)
    color = req.query.color;
  var text = "Dynamic Badges/SVG Animated Text";
  if (req.query.text)
    text = req.query.text;
  var repeatCount = "indefinite";
  if (req.query.repeatCount)
    repeatCount = req.query.repeatCount;
  var font = "Montserrat";
  if (req.query.font)
    font = req.query.font;
  var fontSize = 26;
  if (req.query.fontSize)
    fontSize = req.query.fontSize;
  res.send(
    `
    <svg width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
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

app.get('/api/age/:dd/:mm/:yyyy/:color/:style', (req, res) => {
  var day = req.params.dd;
  var month = req.params.mm;
  var year = req.params.yyyy;
  const rawMiliseconds = new Date() - new Date(`${day}/${month}/${year}`);
  const rawSeconds = Math.floor(rawMiliseconds / 1000);
  const rawMinutes = Math.floor(rawSeconds / 60);
  const rawHours = Math.floor(rawMinutes / 60);
  const rawDays = Math.floor(rawHours / 24);
  const rawMonths = Math.floor(rawDays / 30);
  const rawYears = Math.floor(rawDays / 365);

  const seconds = rawSeconds % 60;
  const minutes = rawMinutes % 60;
  const hours = rawHours % 24;
  const days = rawDays % 30;
  const months = rawMonths % 12;
  const years = rawYears;
  var col = "green";
  var st = "for-the-badge";
  if (req.params.color)
    col = req.params.color;
  if (req.params.style)
    st = req.params.style;

  var output = {
    "schemaVersion": 1,
    "label": "Age",
    "message": `${years} years, ${months} months, ${days} days`,
    "color": col,
    "style": st
  };
  res.json(output);
});

app.get('/age/:dd/:mm/:yyyy', (req, res) => {
  var col = "green";
  var st = "for-the-badge";
  if (req.query.color)
    col = req.query.color;
  if (req.query.style)
    st = req.query.style;
  res.redirect("https://img.shields.io/endpoint?url=" + encodeURIComponent(`https://dynamic-badges.maxalpha.repl.co/api/age/${req.params.dd}/${req.params.mm}/${req.params.yyyy}/${col}/${st}`));
  
});

app.get('/*', (req, res) => {
  res.redirect("https://github.com/Jaysmito101/dynamic-badges");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
});