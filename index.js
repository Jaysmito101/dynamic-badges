const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const Database = require("@replit/database");

app.use(cookieParser());
const db = new Database()


app.get('/api/views', (req, res) => {
  var key = "views-data";

  db.get(key).then(value => {
    res.send(value);
  });
});

app.get('/views', (req, res) => {

  var key = "views-data"
  db.get(key).then(value => {
    var val = 0;
    if (value[encodeURIComponent(req.query.id)] == undefined) {
      value[encodeURIComponent(req.query.id)] = 0;
      db.set(key, value).then(() => { });
    }
    else {
      val = value[encodeURIComponent(req.query.id)] + 1;
      value[encodeURIComponent(req.query.id)] = val;
    }

    db.set(key, value).then(() => {
      var col = "rgb(60, 200, 60)";
      var fn = "Roboto";
      var st = "for-the-badge";
      if (req.query.color)
        col = req.query.color;
      if (req.query.font)
        st = req.query.font;
      var expiryDate = new Date(Number(new Date()) - 100000);

      res.set({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache,max-age=0,no-store,s-maxage=0,proxy-revalidate',
        'Expires': expiryDate,
        'etag': false
      });
      res.send(
        `
        <svg height="40" width="170" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    <a href="https://github.com/Jaysmito101/dynamic-badges">
	<rect width="100" height="50" style="fill:rgba(60, 60, 60);" />
    <rect width="70" height="50" style="fill:${col};" transform="translate(100 0)" />
	 <text y="55%" x="10%"  font-family="${fn}" dominant-baseline="middle" fill="#fff">Views</text>
     <text y="55%" x="65%" font-family="${fn}" dominant-baseline="middle" fill="#fff">${val}</text>
  Sorry, your browser does not support inline SVG.
  </a>
</svg>
        `
      );

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
    <a href="https://github.com/Jaysmito101/dynamic-badges">
 <path id="path">
		<animate attributeName="d" from="m0,110 h0" to="m0,110 h1100" dur="${duration}s" begin="0s" repeatCount="${repeatCount}"/>
	</path>
	<text font-size="${fontSize}" font-family="${font}" fill='${color}'>
		<textPath xlink:href="#path">${text}</textPath>
	</text>
  </a>
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
  var font = "Montserrat";
  if (req.query.font)
    font = req.query.font;

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
  var day = req.params.dd;
  var month = req.params.mm;
  var year = req.params.yyyy;
  var col = "green";
  var st = "for-the-badge";
  if (req.query.color)
    col = req.query.color;
  var fn = "Montserrat";
  if (req.query.font)
    fn = req.query.font;
  if (req.query.style)
    st = req.query.style;
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
  var expiryDate = new Date(Number(new Date()) - 100000);
  var txt = `${years} years, ${months} months, ${days} days`;
  res.set({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache,max-age=0,no-store,s-maxage=0,proxy-revalidate',
    'Expires': expiryDate,
    'etag': false
  });

  res.send(
    `
<svg height="40" width="350" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    <a href="https://github.com/Jaysmito101/dynamic-badges">
	<rect width="70" height="50" style="fill:rgba(60, 60, 60);" />
    <rect width="280" height="50" style="fill:${col};" transform="translate(70 0)" />
	 <text y="55%" x="5%"  font-family="${fn}" dominant-baseline="middle" fill="#fff">Age</text>
     <text y="55%" x="30%" font-family="${fn}" dominant-baseline="middle" fill="#fff">${txt}</text>
  Sorry, your browser does not support inline SVG.
  </a>
</svg>
`
  );

});

app.get('/api/star', (req, res) => {

  db.get("ratings").then(value => {
    res.json(value);
  });
});

app.get('/star', (req, res) => {
  if (req.query.image) 
  {
    res.sendFile(path.join(__dirname, 'static/star.png'));
    return;
  }

  var uname = "Jaysmito101";
  var repo = "dynamic-badges";
  var id = 0;
  if (req.query.id)
    id = req.query.id;
  if (req.query.uname)
    uname = req.query.uname;
  if (req.query.repo)
    repo = req.query.repo;
  var key = encodeURIComponent(uname) + "-" + encodeURIComponent(repo);

  if(req.query.show)
  {
    var rat = 0;
    db.get("ratings").then(value => {
      if(value[key] != undefined)
      {
        rat = value[key].score/value[key].count;
      }
      res.set({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache,max-age=0,no-store,s-maxage=0,proxy-revalidate',
    'etag': false
  });
      res.send(
      `
      <svg 
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="60" height="50">
	<text y="75%" x="0%" fill="red"
    font-size="25" font-family="Open Sans">${rat.toFixed(2)} </text>
</svg>
      `
    );
    });
    return;
  }

  if (req.cookies["rated-" + key]) {
    res.redirect(`https://github.com/${uname}/${repo}`);
    return;
  }
  let options = {
    maxAge: 1000 * 60 * 30 // would expire after 30 minutes
  }


  db.get("ratings").then(value => {
    var val = 0;
    var count = 0;
    if (value[key] != undefined) {
      val = value[key].score;
      count = value[key].count;
    }
    else {
      value[key] = {};
    }
    value[key].score = (parseInt(val) + parseInt(id));
    value[key].count = count + 1;
    db.set("ratings", value).then(() => {
      res.cookie('rated-' + key, id, options)
      res.redirect(`https://github.com/${uname}/${repo}`);
    });
  });
});

app.get('/*', (req, res) => {
  res.redirect("https://github.com/Jaysmito101/dynamic-badges");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
});