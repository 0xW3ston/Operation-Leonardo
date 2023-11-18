const connection = require('./connection')

const formateursModel = {
    createformateur: async function(nom,prenom,email,password) {
      const results = await connection.execute('INSERT INTO users (nom, prenom,email,password,type, Mail_Verified) VALUES (?, ?,?,?,?, 1)', [nom,prenom,email,password,"formateur"])
      .catch((err) => {throw err});

      // No Return
    },
    getAllformateurs: async function() {
      const results = await connection.execute('SELECT * FROM users where type = ?',['formateur'])
      .catch((err) => {throw err});

      return results[0]
    },
    updateformateurs: async function(id,nom,prenom,email,password){
      const results = await connection.execute('UPDATE users SET nom = ? , prenom = ? , email = ? , password = ? where id = ?',[nom,prenom,email,password,id])
      .catch((err) => {throw err});

      return results[0]
    },
    deleteformateur: async function(id){
      const results = await connection.execute('DELETE FROM users WHERE id = ?',[id])
      .catch((err) => {throw err});

      return results[0]
    },
    getformateurById: async function(id) {
      const results = await connection.execute('SELECT * FROM users where id = ?',[id])
      .catch((err) => {throw err});

      return results[0][0]
    }
};
module.exports = formateursModel;
