const connection = require('./connection')

const FormationsModel = {
  createFormation: async function(label,duree,description) {
    const reasult = await connection.query('INSERT INTO Formations (label, duree,description) VALUES (?, ?,?)', [label,duree,description])
    .catch((err)=>{throw err})
},
    getAllFormations: async function() {
      const results = await connection.execute('SELECT * FROM Formations order by duree desc ,id desc ')
      .catch((err) => {throw err});

      return results[0];
    },
    updateFormations: async function(id,label,duree,description){
      const results = await connection.execute('UPDATE Formations SET label = ? , duree = ? , description = ? where id = ?',[label,duree,description,id])
			.catch((err) => {throw err});

      return results[0];
    },
    // const results = [data, informationBonus]
    deleteFormation: async function(id){
      const results = await connection.execute('DELETE FROM Formations WHERE id = ?',[id])
			.catch((err) => {throw err});

      return results[0]
    },
    getFormationById: async function(id) {
      const results = await connection.execute('SELECT * FROM Formations where id = ?',[id])
			.catch((err) => {throw err});

      return results[0][0];
    },
    addImages : async function(FormationId,path){
      const results = await connection.execute('INSERT INTO Formations_images (FormationId,path) VALUES (?, ?,?)', [FormationId,path])
			.catch((err) => {throw err});

      // No return
    },
    maxFormationId :async function(){
      const results = await connection.query('SELECT max(id) as maxId FROM Formations ')
      .catch((err)=>{throw err})
        return results[0];
      
    },
    insertFormationimages : async function(FormationId,path){
      connection.query('INSERT INTO Formations_images (FormationId,path) VALUES  (? , ?)',[FormationId,path])
      .catch((err)=>{throw err})
      
    },

    //=========
    getFormationImages: async function(Formationid){
      const result = await connection.execute('SELECT id,path FROM Formations_images where FormationId = ? order by id ',[Formationid])
      .catch((err) => {throw err});
      return result[0]
}
,
  deleteImage: async function(id,callback){
    const results = await connection.execute('DELETE FROM Formations_images WHERE id = ?',[id])
    .catch((err)=>{throw err})
      return results
  }
  ,


getPathByImage: async function(id){
 const result = await connection.execute('SELECT path FROM Formations_images where id = ? ',[id])
  .catch((err)=>{throw err})
  return result[0][0];

},

getPathByFormationId: async (id)=>{
  const results = await connection.query('SELECT path FROM Formations_images where FormationId = ?  ',[id])
  .catch((err)=>{throw err})
  return results[0]
} ,

getFormationsLongDuree: async function() {
  const results = await connection.execute('SELECT * FROM Formations where duree =2 order by id desc')
  .catch((err) => {throw err});

  return results[0];
},
getFormationsImages : async ()=>{
  const results = await connection.query('select path,formationid from formations_images  order by id ')
  .catch((err)=>{throw err})
  return results[0]
},
getFormations1jDuree: async function() {
  const results = await connection.execute('SELECT * FROM Formations where duree =1 order by id desc')
  .catch((err) => {throw err});

  return results[0];
},


};
module.exports = FormationsModel;
