const fs = require('fs');
const path = require('path');

function loadDb () {
  const db = fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf8');
  console.log(db);
  
  return db;
}

function saveDb (db) {
  db = decodeURIComponent(db);
  db = db.replace(/\//g, '');
  db = JSON.parse(db);
  console.log(db);
  fs.writeFileSync(path.resolve(__dirname, './db.json'), JSON.stringify(db, null, 2));
}

const http = require('http');

const hostname = '0.0.0.0';
const port = 7777;

const server = http.createServer(function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  // console.log(req);
  if (req.url.split('=')[1]) {
    saveDb(req.url.split('=')[1]);
    res.end('Hello World\n');
  } else {
    res.end(loadDb());
  }
});

server.listen(port, hostname, function() {
  // console.log(`Server running at http://${hostname}:${port}/`);
});