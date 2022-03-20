const { Schema, model, Number } = require('mongoose');

const userSchema = new Schema({
    userName: String,
    passwordEncripted: String,
    name: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    phoneNum: Number,
    addressCalle: String,
    addressColonia: String,
    codPostal: Number
}, {
    timestamps: true
});

module.exports = model('User', userSchema, 'users');