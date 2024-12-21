const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
    creditname: { type: String, required: true },
    creditnum: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    cvv: { type: Number, required: true },
});

const checkout = mongoose.model("checkout", checkoutSchema);
module.exports = checkout;
