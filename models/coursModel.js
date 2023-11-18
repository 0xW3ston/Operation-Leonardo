const connection = require('./connection')

const coursModel = {
    addCour: async function(tutor_id,titre,cours_path,description,montant,payant,password){
      await connection.execute('INSERT INTO cours(tutor_id,titre,cours_path,description,montant,payant,password) VALUES (?,?,?,?,?,?,?)',[tutor_id,titre,cours_path,description,montant,payant,password])
      .catch((err) => {throw err});
      
      // No Return
    },
    updateCourById: async function(id,tutor_id,titre,cours_path,description,montant,payant,password){
        await connection.execute('UPDATE cours SET tutor_id = ? , titre = ? , cours_path = ? , description = ? , montant = ? , payant = ? , password = ? WHERE id = ?',[tutor_id,titre,cours_path,description,montant,payant,password , id])
        .catch((err) => {throw err});
        
        // No Return
    },
    deleteCourById: async function(id){
        await connection.execute('DELETE FROM cours WHERE id = ?',[id])
        .catch((err) => {throw err});

        // No Return
    },
    getAllCours: async function(){
        const results = await connection.execute("SELECT cours.*,CONCAT(users.nom,' ',users.prenom) as formateur_fullname FROM cours INNER JOIN users ON cours.tutor_id = users.id")
        .catch((err) => {throw err});

        return results[0]
    },
    findCourById: async function(id){
        const results = await connection.execute('SELECT * FROM cours WHERE id = ?',[id])
        .catch((err) => {throw err});
        console.log("db result : " + results)
        return results[0][0]
    },
    
    updateCoursPathById : async (id,coursPath)=>{
        await connection.execute('update cours set cours_path = ? where id = ?',[coursPath,id])
        .catch((err)=>{throw err})
    },
    Top10CoursByKeyword: async function(keyword){
        const results = await connection.execute('SELECT * FROM Cours WHERE MATCH (titre) AGAINST (? IN NATURAL LANGUAGE MODE) ORDER BY MATCH (titre) AGAINST (? IN NATURAL LANGUAGE MODE) DESC LIMIT 10',[keyword,keyword])
        .catch((err) => {throw err});

        return results[0]
    }
};
module.exports = coursModel;
