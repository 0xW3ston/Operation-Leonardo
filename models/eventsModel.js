const connection = require('./connection')

const eventsModel = {
  createEvent: async function(label,caption,description) {
    const reasult = await connection.query('INSERT INTO events (label, caption,description) VALUES (?, ?,?)', [label,caption,description])
    .catch((err)=>{throw err})
},
    getAllEvents: async function() {
      const results = await connection.execute('SELECT * FROM events order by id desc')
      .catch((err) => {throw err});

      return results[0];
    },
    updateEvents: async function(id,label,caption,description){
      const results = await connection.execute('UPDATE events SET label = ? , caption = ? , description = ? where id = ?',[label,caption,description,id])
			.catch((err) => {throw err});

      return results[0];
    },
    // const results = [data, informationBonus]
    deleteEvent: async function(id){
      const results = await connection.execute('DELETE FROM events WHERE id = ?',[id])
			.catch((err) => {throw err});

      return results[0]
    },
    getEventById: async function(id) {
      const results = await connection.execute('SELECT * FROM events where id = ?',[id])
			.catch((err) => {throw err});

      return results[0][0];
    },
    addImages : async function(eventId,path){
      const results = await connection.execute('INSERT INTO events_images (eventId,path) VALUES (?, ?,?)', [eventId,path])
			.catch((err) => {throw err});

      // No return
    },
    maxEventId :async function(){
      const results = await connection.query('SELECT max(id) as maxId FROM events ')
      .catch((err)=>{throw err})
        return results[0];
      
    },
    insertEventimages : async function(eventId,path){
      connection.query('INSERT INTO events_images (eventId,path) VALUES  (? , ?)',[eventId,path])
      .catch((err)=>{throw err})
      
    },

    //=========
    getEventImages: async function(eventid){
      const result = await connection.execute('SELECT id,path FROM events_images where eventId = ? order by id ',[eventid])
      .catch((err) => {throw err});
      return result[0]
}
,
  deleteImage: async function(id,callback){
    const results = await connection.execute('DELETE FROM events_images WHERE id = ?',[id])
    .catch((err)=>{throw err})
      return results
  }
  ,


getPathByImage: async function(id){
 const result = await connection.execute('SELECT path FROM events_images where id = ? ',[id])
  .catch((err)=>{throw err})
  return result[0][0];

},

getPathByEventId: async (id)=>{
  const results = await connection.query('SELECT path FROM events_images where eventId = ?  ',[id])
  .catch((err)=>{throw err})
  return results[0]
},
getTopSixEventsImages : async ()=>{
  const results = await connection.query('select path,eventid from events_images where eventid >= (select max(eventId)-6 from events_images) order by id ')
  .catch((err)=>{throw err})
  return results[0]
}



};
module.exports = eventsModel;
