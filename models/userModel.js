const connection = require('./connection')

const userModel = {
  getNumberUsersByEmail: async function(email) {
    console.log("test 1")
    const result = await connection.execute('SELECT count(*) as n FROM users where email = ? ',[email])
    .catch((err) => {
      throw err;
    });
    return result[0];
  },
  getUnverifiedUsersByToken: async function(token){
    console.log("test 7")
    const result = await connection.execute('SELECT * FROM users where Verify_Token = ? AND Mail_Verified = false',[token])
    .catch((err) => {
      throw err;
    });
    return result[0][0];
  },
  getUserBySessionKey: async function(sessionKey) {
    console.log("test 2")
    const results = await connection.execute('SELECT * FROM users WHERE session_key = ? ', [sessionKey])
    .catch((err) => {
      throw err;
    });
    return results[0][0];
  },

  getUserByEmail: async function(email) {
    console.log("test 3")
    const results = await connection.execute('SELECT * FROM users WHERE email = ? ', [email])
    .catch((err) => {
      throw err;
    });
    console.log(results[0]);
    return results[0][0];
  },

  createUser: async function(email,nom,prenom,password,verifyToken) {
    console.log("test 4")
    const results = await connection.execute('INSERT INTO users (email,nom,prenom,password,Verify_Token) VALUES (?,?,?,?,?)', [email,nom,prenom,password,verifyToken])
    .catch((err) => {
      throw err;
    });
  },
  updateSessionKey: async function(sessionKey,id) {
    console.log("test 5")
    const results = await connection.execute('update users set session_key = ? where id = ?', [sessionKey,id])
    .catch((err) => {
      throw err;
    });
  },
  getAllUserDataByEmail: async function(email){
    console.log("test 6");
    const results = await connection.execute('SELECT * FROM users WHERE email = ?', [email])
    .catch((err) => {
      throw err;
    });
    return results[0][0];
  },
  activateUserByToken: async function(token){
    console.log("test 6");
    const results = await connection.execute('update users set Mail_Verified = true where Verify_Token = ?', [token])
    .catch((err) => {
      throw err;
    });
  }
};

module.exports = userModel;
