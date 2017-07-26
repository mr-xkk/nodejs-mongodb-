var mongoose = require('./db'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : String,
    userpsw : String,
    logindate : Date
})

module.exports = mongoose.model('User',UserSchema);