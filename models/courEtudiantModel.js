const connection = require('./connection')

const courEtudiantModel = {
    addCourEtudiant: async function(id_cours,id_etudiant){
      await connection.execute('INSERT INTO Etudiant_Cour(id_cours,id_etudiant) VALUES (?,?)',[id_cours,id_etudiant])
      .catch((err) => {throw err});
      
      // No Return
    },
    deleteCourEtudiant: async function(id_cours,id_etudiant){
        await connection.execute('DELETE FROM Etudiant_Cour WHERE id_cours = ? AND id_etudiant = ?',[id_cours,id_etudiant])
        .catch((err) => {throw err});
        
        // No Return
    },
    findCourEtudiant: async function(id_cours,id_etudiant){
      const result = await connection.execute('SELECT * FROM Etudiant_Cour WHERE id_cours = ? AND id_etudiant = ?',[id_cours,id_etudiant])
      .catch((err) => {throw err});
      
      return result[0][0]

    },
    findEtudiantParCours: async function(id_cours,id_etudiant){
      const result = await connection.execute('SELECT * FROM Etudiant_Cour WHERE id_cours = ? ',[id_cours])
      .catch((err) => {throw err});
      
      return result[0]

    }
};
module.exports = courEtudiantModel;