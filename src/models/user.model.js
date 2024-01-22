const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
    id: String,
    quantity: Number
});

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: {
        type: String,
        lowercase: true,
        // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: String,
    wallet: { cryptoSchema }
}, { collection: 'Users' });

module.exports = mongoose.model("User", userSchema);