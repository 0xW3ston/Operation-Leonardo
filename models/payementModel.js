const connection = require('./connection')

const payementModel = {
    addPayement: async function(id_cours,id_etudiant,payement_montant,payement_method,payement_payer_id,payement_transaction_id){
        await connection.execute('INSERT INTO payement(id_cours,id_etudiant,payement_montant,payement_method,payement_payer_id,payement_transaction_id) VALUES (?,?,?,?,?,?)',[id_cours,id_etudiant,payement_montant,payement_method,payement_payer_id,payement_transaction_id])
        .catch((err) => {throw err});
      
        // No Return
    },
    deletePayement: async function(id_cours,id_etudiant){
        await connection.execute('DELETE FROM payement WHERE id_cours = ? AND id_etudiant = ?',[id_cours,id_etudiant])
        .catch((err) => {throw err});
        
        // No Return
    }
};
module.exports = payementModel;