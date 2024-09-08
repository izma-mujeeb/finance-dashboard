import mongoose from "mongoose";

const expense = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    date: {type: String, required: true} 
})

const income = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    date: {type: String, required: true}
})

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    expenses: [expense],
    incomes: [income]
})

export default mongoose.model("users", userSchema);