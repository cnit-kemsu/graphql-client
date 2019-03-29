const sqlite3 = require('sqlite3').verbose();
const file = './test/localdb';

module.exports = {

  run: (query, params = {}) => new Promise((resolve, reject) => {
  
    const db = new sqlite3.Database(file);

    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    db.close();
  
  }),

  all: (query, params = []) => new Promise((resolve, reject) => {
  
    const db = new sqlite3.Database(file);
    db.all(query, params, function (err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
    db.close();
  
  })

};