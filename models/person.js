const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name:{type:String,required:true},
    role:{type:String,required:true},
    politicalParty:{type:String,required:true},
});

module.exports = mongoose.model('Person', PersonSchema);

