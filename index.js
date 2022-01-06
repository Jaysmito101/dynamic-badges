const express = require("express");
const fetch = require('node-fetch');
const cookieParser = require("cookie-parser");
const fs = require('fs');
const path = require("path");
const app = express();
const Database = require("@replit/database");

app.use(cookieParser());
const db = new Database();

Array.prototype.random = function() {
  return this[Math.floor((Math.random() * this.length))];
};

const memesData = JSON.parse(fs.readFileSync('./memes.json', 'utf8'));

app.get('/meme', (req, res) => {
  var w = "400";
  if (req.query.w)
    w = req.query.w;
  var h = "400";
  if (req.query.h)
    h = req.query.h;
  res.set({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache,max-age=0,no-store,s-maxage=0,proxy-revalidate'
  });
  res.send(
    `
    <svg width="${w}" height="${h}"
  xmlns="http://www.w3.org/2000/svg">
  <image href="${memesData.random()}" height="${h}" width="${w}"/>
</svg>
    `
  );
});

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
  if (req.query.image) {
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

  if (req.query.show) {
    var rat = 0;
    db.get("ratings").then(value => {
      if (value[key] != undefined) {
        rat = value[key].score / value[key].count;
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
    if (req.query.tourl)
      res.redirect(req.query.tourl);
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
      res.cookie('rated-' + key, id, options);
      if (req.query.tourl)
        res.redirect(req.query.tourl);
      res.redirect(`https://github.com/${uname}/${repo}`);
    });
  });
});

function sendScore(res, score) {
  if (score == undefined || score == null || score == NaN)
    score = 0;
  var expiryDate = new Date(Number(new Date()) + 1000 * 60 * 10);
  res.set({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'max-age=600,s-maxage=600'
    ,
    'Expires': expiryDate
  });
  res.send(
    `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" width="100" height="200">
     <text x="10" y="-10%" font-size="150" font-family="Open Sans" fill="red">${score.toFixed(2)}</text>

<path style="fill:#ECF0F1;" d="M369.059,52.352v153.537c0,14.104-3.141,27.6-7.329,40.049v0.01
	c-16.753,42.384-57.426,72.497-105.474,72.497c-47.975,0-88.98-30.018-105.157-72.298c-0.031-0.063-0.117-0.136-0.138-0.199
	c-2.974-7.779-5.095-15.978-6.257-24.469c-0.346-2.544-0.463-5.11-0.641-7.706c-0.178-2.607-0.117-5.235-0.117-7.884V52.352H369.059
	z"/>
<rect x="229.813" y="319.869" style="fill:#F8C660;" width="52.352" height="76.434"/>
<path style="fill:#ECF0F1;" d="M329.283,448.654H182.698v-20.581c0-17.546,14.224-31.771,31.771-31.771h83.043
	c17.546,0,31.771,14.224,31.771,31.771v20.581H329.283z"/>
<g>
	<path style="fill:#F8C660;" d="M371.164,501.006H140.816v-20.581c0-17.546,14.224-31.771,31.771-31.771h166.806
		c17.546,0,31.771,14.224,31.771,31.771v20.581H371.164z"/>
	<rect x="143.433" y="9.566" style="fill:#F8C660;" width="225.112" height="41.881"/>
	<path style="fill:#F8C660;" d="M151.039,245.948c-31.17-4.24-59.223-18.711-80.415-39.892
		c-25.453-25.453-41.255-60.163-41.255-98.997c0-24.679,19.944-44.237,44.623-44.237h69.956v41.881H74.002
		c-1.55,0-2.454,0.806-2.454,2.356c0,45.2,30.517,82.957,72.398,94.631v4.199C143.947,219.992,146.286,233.499,151.039,245.948z"/>
	<path style="fill:#F8C660;" d="M482.67,107.059c0,38.835-15.737,73.769-41.19,99.222c-21.171,21.161-48.894,35.498-80.024,39.768
		c4.754-12.449,7.603-26.059,7.603-40.161v-4.146c40.834-11.601,71.993-49.41,71.993-94.683c0-1.55-1.519-2.356-3.069-2.356h-68.923
		V62.822h68.923C462.661,62.822,482.67,82.381,482.67,107.059z"/>
	<path style="fill:#F8C660;" d="M314.82,181.996c0,9.537-14.27,15.332-18.725,23.034c-4.596,7.945-2.637,23.153-10.582,27.751
		c-7.701,4.455-19.789-4.714-29.325-4.714c-9.537,0-21.624,9.17-29.325,4.714c-7.945-4.596-5.986-19.806-10.582-27.751
		c-4.455-7.701-18.726-13.496-18.726-23.034s14.27-15.332,18.725-23.034c4.596-7.945,2.637-23.153,10.582-27.751
		c7.701-4.456,19.789,4.714,29.325,4.714c9.537,0,21.624-9.17,29.325-4.714c7.945,4.596,5.986,19.806,10.582,27.751
		C300.55,166.663,314.82,172.458,314.82,181.996z"/>
</g>
<g>
	<path style="fill:#231F20;" d="M368.757,255.406c30.472-5.416,58.07-19.807,80.124-41.852
		c28.54-28.54,44.259-66.191,44.259-106.495c0-30.311-24.743-54.708-55.157-54.708h-58.453c0-1.047,0-1.877,0-2.526V9.566
		c0-5.783-5.202-9.566-10.983-9.566H143.435c-5.782,0-9.957,3.783-9.957,9.566v41.881c0,0.129-0.498-0.142-0.494,0.905H73.992
		c-30.401,0-55.133,24.388-55.133,54.698c0,40.226,15.726,77.966,44.283,106.524c21.807,21.795,50.146,36.46,80.351,41.837
		c9.052,20.653,23.513,38.302,42.126,51.346c10.426,7.306,22.196,12.842,33.713,16.576v63.023h-4.865
		c-23.292,0-42.252,18.426-42.252,41.718v10.12c-23.035,0.195-41.881,19.061-41.881,42.232v20.581
		c0,5.783,4.698,10.994,10.481,10.994h230.348c5.782,0,10.46-5.211,10.46-10.994v-20.581c0-23.171-18.847-42.037-41.881-42.232
		v-10.12c0-23.292-18.939-41.718-42.231-41.718h-4.885v-62.974C326.131,313.015,353.777,288.661,368.757,255.406z M82.214,115.174
		h51.263v71.538C105.207,173.57,85.054,145.538,82.214,115.174z M379.53,115.174h50.54c-2.835,30.364-22.27,58.376-50.54,71.562
		V115.174z M437.983,73.292c18.869,0,34.218,15.004,34.218,33.767c0,34.71-13.54,67.234-38.123,91.817
		c-16.244,16.235-35.974,27.586-57.758,33.471c1.671-7.529,2.622-15.211,2.843-22.923c42.885-15.496,72.201-56.357,72.201-102.349
		c0-7.217-6.003-12.843-13.381-12.843h-58.453v-20.94H437.983z M154.417,20.941h204.172v20.941H154.417L154.417,20.941
		L154.417,20.941z M77.948,198.653c-24.6-24.601-38.149-56.961-38.149-91.594c0-18.763,15.339-33.767,34.193-33.767h59.485v20.941
		H74.002c-7.337,0-13.083,5.488-13.083,12.826c0,24.3,7.814,47.135,22.597,66.286c12.701,16.453,30.134,29.018,49.689,36.066
		c0.005,0.192,0.216,12.659,2.723,22.863C114.169,226.347,94.005,214.702,77.948,198.653z M160.799,242.405
		c-0.076-0.199,0-0.396-0.088-0.589c-2.621-6.945-6.294-24.425-6.294-35.927V62.822h204.172v143.067
		c0,11.082-2.356,23.028-6.875,36.515c-15.889,39.843-53.401,65.571-95.538,65.571C214.182,307.975,175.805,281.625,160.799,242.405
		z M360.683,480.426v10.634H151.276v-10.634c0-11.746,9.566-20.777,21.311-20.777h166.806
		C351.138,459.648,360.683,468.68,360.683,480.426z M318.802,428.074v10.634H193.157v-10.634c0-11.746,9.566-20.777,21.311-20.777
		h83.043C309.257,407.297,318.802,416.328,318.802,428.074z M271.685,386.356h-31.411V327.89c5.235,0.668,10.487,1.025,15.813,1.025
		c5.27,0,10.363-0.352,15.598-1.002V386.356z"/>
	<path style="fill:#231F20;" d="M265.132,240.953c4.656,1.641,10.016,3.531,15.5,3.531c3.372,0,6.792-0.715,10.123-2.642
		c8.961-5.184,10.768-15.102,12.221-23.074c0.589-3.233,1.256-6.898,2.181-8.497c0.823-1.422,3.681-3.814,5.978-5.737
		c5.974-5.003,14.157-11.853,14.157-22.54c0-10.686-8.182-17.537-14.157-22.54c-2.296-1.922-5.155-4.316-5.976-5.737
		c-0.926-1.6-1.594-5.264-2.183-8.498c-1.453-7.97-3.26-17.889-12.219-23.071c-8.745-5.06-18.103-1.763-25.624,0.888
		c-3.215,1.134-6.861,2.419-8.946,2.419c-2.085,0-5.73-1.285-8.946-2.419c-7.517-2.649-16.875-5.95-25.623-0.888
		c-8.961,5.184-10.768,15.102-12.22,23.074c-0.589,3.233-1.257,6.897-2.182,8.496c-0.823,1.422-3.681,3.815-5.978,5.738
		c-5.974,5.003-14.157,11.853-14.157,22.54c0,10.686,8.182,17.538,14.157,22.54c2.296,1.923,5.155,4.317,5.976,5.737
		c0.926,1.6,1.594,5.264,2.183,8.498c1.453,7.97,3.26,17.889,12.22,23.072c8.744,5.059,18.103,1.762,25.623-0.889
		c3.215-1.134,6.861-2.419,8.946-2.419S261.916,239.82,265.132,240.953z M240.279,221.204c-2.428,0.855-6.329,2.23-8.146,2.332
		c-0.878-1.629-1.653-5.881-2.134-8.521c-0.895-4.912-1.91-10.479-4.658-15.229c-2.672-4.618-6.732-8.018-10.659-11.306
		c-2.226-1.864-5.882-4.926-6.603-6.484c0.72-1.558,4.377-4.621,6.603-6.484c3.926-3.288,7.987-6.686,10.66-11.306
		c2.747-4.75,3.762-10.317,4.657-15.228c0.481-2.64,1.255-6.893,2.134-8.521c1.816,0.101,5.718,1.476,8.146,2.332
		c4.8,1.692,10.24,3.609,15.907,3.609s11.107-1.917,15.907-3.609c2.428-0.855,6.329-2.231,8.146-2.332
		c0.877,1.629,1.653,5.881,2.134,8.521c0.895,4.912,1.91,10.479,4.658,15.229c2.672,4.618,6.732,8.018,10.659,11.305
		c2.226,1.864,5.882,4.926,6.603,6.484c-0.72,1.558-4.377,4.621-6.603,6.484c-3.926,3.288-7.987,6.686-10.66,11.306
		c-2.747,4.75-3.762,10.317-4.657,15.229c-0.481,2.64-1.255,6.893-2.134,8.521c-1.816-0.101-5.718-1.475-8.146-2.332
		c-4.8-1.692-10.239-3.609-15.907-3.609S245.079,219.512,240.279,221.204z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
</svg>

            `
  );
}


app.get('/api/score', (req, res) => {

  db.get("trophies").then(value => {
    res.json(value);
  });
});

app.get('/score/:user', (req, res) => {

  db.get("trophies").then(value => {
    if (value[req.params.user]) {
      if (Number(new Date()) - Number(new Date(value[req.params.user].time)) < 1000 * 60 * 60) {
        sendScore(res, value[req.params.user].score);
        return;
      }
    }
    var headers = {
      'Authorization': 'token ' + process.env["PAT"]
    };
    fetch(`https://api.github.com/users/${req.params.user}/repos?per_page=100`, { method: 'GET', headers: headers })
      .then(ress => ress.text())
      .then(text => {

        var repos = JSON.parse(text);
        var data = {};
        data.st = 0;
        data.wt = 0;
        data.ft = 0;
        data.repos = [];
        data.count = 0;
        for (var i = 0; i < repos.length; i++) {
          var repo = {};
          repo.name = repos[i].name;
          repo.stars = repos[i].stargazers_count;
          repo.forks = repos[i].forks_count;
          repo.watchers = repos[i].watchers_count;
          data.repos.push(repo);
          data.st += repo.stars;
          data.wt += repo.watchers;
          data.ft += repo.forks;
        }

        fetch(`https://api.github.com/users/${req.params.user}`, { method: 'GET', headers: headers }).then(ress => ress.text()).then(text => {
          data.followers = JSON.parse(text).followers;
          data.following = JSON.parse(text).following;
          fetch(`https://api.github.com/users/${req.params.user}/events?per_page=10000`, { method: 'GET', headers: headers }).then(ress => ress.text()).then(text => {
            data.total = JSON.parse(text).length;

            var score = 0;
            score += data.st / data.repos.length;
            score += data.wt / data.repos.length * 10;
            score += data.wt / data.repos.length * 5;
            if (data.following == 0)
              data.following = 1;
            score += data.followers / data.following;
            score += data.total / 10;

            db.get("trophies").then(value => {
              if (value == undefined)
                value = {};
              value[req.params.user] = { "score": score, "time": new Date() };

              db.set("trophies", value).then(() => { });
              sendScore(res, score);
            });
          });
        });
      });
  });

});

app.get('/*', (req, res) => {
  res.redirect("https://github.com/Jaysmito101/dynamic-badges");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
});