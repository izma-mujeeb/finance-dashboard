import express from "express";
import connect from "./db/connect.js";
import userSchema from "./models/User.js";
import cors from "cors";

const app = express();
app.use(express.json()); 
app.use(cors())

app.post("/signup", async(req, res) => {
    let user = new userSchema(req.body);
    let result = await user.save();
    res.send(result); 
})

app.get("/getUsers", (req, res) => {
    userSchema.find()
    .then(users => res.json(users))
    .catch(error => console.log(error))
})

app.post("/dashboard/:username", (req, res) => {
    const {expenseName, expenseCategory, expensePrice, expenseDate} = req.body;
    try {
        userSchema.updateOne({username: req.params['username']}, {$addToSet: {expenses: {name: expenseName, category: expenseCategory, price: expensePrice, date: expenseDate}}}) // change username value 
        .then(err => console.log(err))
        res.send({status: "Ok", data: "Updated"});
    } catch (error){
        console.log(error)
    }
}) 

app.post("/dashboard2/:username", (req, res) => {
    const {incomeName, incomePrice, incomeDate} = req.body;
    try {
        userSchema.updateOne({username: req.params['username']}, {$addToSet: {incomes: {name: incomeName, price: incomePrice, date: incomeDate}}})
        .then(err => console.log(err))
        res.send({status: "Ok", data: "Updated"})
    } catch (error) {
        console.log(error);
    }
})

app.post("/deleteExpense/:username", (req, res) => {
    const {name, price, date} = req.body;
    try {
        userSchema.updateOne({username: req.params['username']}, {$pull: {expenses: {name, price, date}}})
        .then(err => console.log(err))
        res.send({status: "Ok", data: "Deleted"})
    } catch (error){
        console.log(error);
    } 
})

app.post("/deleteIncome/:username", (req, res) => {
    const {name, price, date} = req.body;
    try {
        userSchema.updateOne({username: req.params['username']}, {$pull: {incomes: {name, price, date}}})
        .then(err => console.log(err))
        res.send({status: "Ok", data: "Deleted"})
    } catch (error){
        console.log(error);
    } 
})

app.listen(4000); 