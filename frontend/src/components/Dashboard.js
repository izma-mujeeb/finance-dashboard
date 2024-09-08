import {React, useEffect, useState} from "react";
import Account from "./Accounts";
import { useLocation } from "react-router-dom";
import {nanoid} from "nanoid";
import Piechart from "./Piechart";


let categoryOn = true;
let deleted = false;
let expensesAdded = false;
let incomesAdded = false;

function Dashboard() {
    const location = useLocation();
    const data = location.state;

    const [expenseName, setExpenseName] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [expensePrice, setExpensePrice] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [expenses, setExpenses] = useState([]); 

    const [incomeName, setIncomeName] = useState("");
    const [incomePrice, setIncomePrice] = useState("");
    const [incomeDate, setIncomeDate] = useState("");
    const [incomes, setIncomes] = useState([]);

    const [utilities, setUtilities] = useState(0.0);
    const [housing, setHousing] = useState(0.0);
    const [food, setFood] = useState(0.0);
    const [personal, setPersonal] = useState(0.0);

    const [utilCount, setUtilCount] = useState(0);
    const [housingCount, setHousingCount] = useState(0);
    const [foodCount, setFoodCount] = useState(0);
    const [personalCount, setPersonalCount] = useState(0);
    
    const [balance, setBalance] = useState(0.0);

    useEffect(() => {
        document.body.style.backgroundColor = "#163D45";
        getAllExpenses();
        getAllIncomes(); 
    }, [])

    async function handleSubmit() { // for expenses 
        let result = await fetch(`http://localhost:4000/dashboard/${data.username}`, {
            method: "POST",
            body: JSON.stringify({expenseName, expenseCategory, expensePrice, expenseDate}),
            headers: {
                "Content-Type": "application/json"
            },
        })
        result = await result.json();
        localStorage.setItem("users", JSON.stringify(result));
        setBalance(balance => balance - Number(expensePrice));
        setExpenseName("");
        setExpenseCategory("");
        setExpensePrice("");
        setExpenseDate("");
        categoryOn = false;
        expensesAdded = true;
        getAllExpenses();
    }

    async function handleSubmit2() { // for incomes 
        let result = await fetch(`http://localhost:4000/dashboard2/${data.username}`, {
            method: "POST",
            body: JSON.stringify({incomeName, incomePrice, incomeDate}),
            headers: {
                "Content-Type": "application/json"
            },
        })
        result = await result.json();
        localStorage.setItem("users", JSON.stringify(result));
        setBalance(balance => balance + Number(incomePrice));
        setIncomeName("");
        setIncomePrice("");
        setIncomeDate("");
        incomesAdded = true;
        getAllIncomes();  
    }

    async function getAllExpenses() {
        let result = await fetch("http://localhost:4000/getUsers", {
            method: "GET"
        })
        result = await result.json();
        result.forEach(res => {
            if (res.username === data.username) {
                const {expenses} = res;
                setExpenses(expenses); // all expenses for current user 
                if (!deleted) categoryOn ? changeCategory(expenses) : changeOne(expenses, expenses.length - 1, true);
                if (!expensesAdded) setExpensesBalance(expenses); 
                return;
            }
        })
    }

    async function getAllIncomes() {
        let result = await fetch("http://localhost:4000/getUsers", {
            method: "GET"
        })
        result = await result.json();
        result.forEach(res => {
            if (res.username === data.username) { // all income for current user 
                const {incomes} = res;
                setIncomes(incomes)
                if (!incomesAdded) setIncomesBalance(incomes);
                return;
            }
        })
    }

    function changeCategory(expenses) {
        for (let x = 0; x < expenses.length; x++) {
            switch (expenses[x].category) {
                case "Utilities":
                    setUtilities(utility => utility + expenses[x].price); 
                    setUtilCount(count => count + 1);
                    break;
                case "Housing":
                    setHousing(housing => housing + expenses[x].price);
                    setHousingCount(count => count + 1);
                    break;
                case "Food":
                    setFood(food => food + expenses[x].price);
                    setFoodCount(count => count + 1);
                    break;
                case "Personal":
                    setPersonal(personal => personal + expenses[x].price);
                    setPersonalCount(count => count + 1);
                    break;
                default:
                    break;
            }
        }
    }

    function changeOne(expenses, index, add) {
        switch (expenses[index].category) {
            case "Utilities":
                add ? setUtilities(utility => utility + expenses[index].price) : setUtilities(utility => utility - expenses[index].price);
                add ? setUtilCount(count => count + 1) : setUtilCount(count => count - 1);
                break;
            case "Housing":
                add ? setHousing(housing => housing + expenses[index].price) : setHousing(housing => housing - expenses[index].price);
                add ? setHousingCount(count => count + 1) : setHousingCount(count => count - 1);
                break;
            case "Food":
                add ? setFood(food => food + expenses[index].price) : setFood(food => food - expenses[index].price);
                add ? setFoodCount(count => count + 1) : setFoodCount(count => count - 1);
                break;
            case "Personal":
                add ? setPersonal(personal => personal + expenses[index].price) : setPersonal(personal => personal - expenses[index].price);
                add ? setPersonalCount(count => count + 1) : setPersonalCount(count => count - 1);
                break;
            default:
                break;
        }
    }

    async function deleteExpense(name, price, date) { 
        let result = await fetch(`http://localhost:4000/deleteExpense/${data.username}`, {
            method: "POST",
            body: JSON.stringify({name, price, date}),
            headers: {
                "Content-Type": "application/json"
            },
        })
        result = await result.json();
        localStorage.setItem("users", JSON.stringify(result));
        changeOne(expenses, expenses.findIndex(expense => expense.name === name), false);
        deleted = true;
        expensesAdded = true;
        setBalance(balance => balance + price)
        getAllExpenses();
    }

    async function deleteIncome(name, price, date) {
        let result = await fetch(`http://localhost:4000/deleteIncome/${data.username}`, {
            method: "POST",
            body: JSON.stringify({name, price, date}),
            headers: {
                "Content-Type": "application/json"
            }, 
        })
        result = await result.json();
        localStorage.setItem("users", JSON.stringify(result));
        incomesAdded = true;
        setBalance(balance => balance - price); 
        getAllIncomes();
    }

    function setExpensesBalance(expenses) {
        for (let x = 0; x < expenses.length; x++) {
            setBalance(balance => balance - expenses[x].price)
        }
    }

    function setIncomesBalance(incomes) {
        for (let x = 0; x < incomes.length; x++) {
            setBalance(balance => balance + incomes[x].price)
        }
    }

    return (
        <div>
            <div className = "dashboard-heading">
                <h1 className = "dashboard-welcome">Welcome Back {data.username}!</h1>
                <h1 className = "dashboard-balance">Total Balance: {balance}</h1>
                <img className = "dashboard-img" src = "/icon.png" alt = ""/> 
            </div><br/> 
            <div className = "section-one">
                <div className = "pie-chart">
                    <h2 className = "pie-chart-title">Pie Chart</h2>
                    <Piechart utilCount = {utilCount} housingCount = {housingCount} foodCount = {foodCount} personalCount = {personalCount}/>
                </div> 
                <div className = "add-expense"> 
                    <h2 className = "add-expense-title">Add Expenses</h2>
                    <input 
                        type = "text" 
                        placeholder = "Name"
                        className = "expense-input"
                        value = {expenseName}
                        onChange = {(e) => setExpenseName(e.target.value)}
                    /><br/><br/>
                    <select className = "expense-input" 
                            value = {expenseCategory} 
                            onChange = {(e) => setExpenseCategory(e.target.value)}
                    > 
                        <option>Category</option>
                        <option>Utilities</option>
                        <option>Housing</option>
                        <option>Food</option> 
                        <option>Personal</option> 
                    </select><br/><br/>
                    <input 
                        type = "number" 
                        placeholder = "Price"
                        className = "expense-input"
                        value = {expensePrice}
                        onChange = {(e) => setExpensePrice(e.target.value)}
                    /><br/><br/> 
                    <input 
                        type = "date" 
                        placeholder = "Date"
                        className = "expense-input"
                        value = {expenseDate}
                        onChange = {(e) => setExpenseDate(e.target.value)}
                    /><br/><br/> 
                    <button className = "submit-expense" onClick = {handleSubmit}>Add</button>
                </div>
                <div className = "add-income">
                <h2 className = "add-income-title">Add Income</h2><br/> 
                    <input 
                        type = "text" 
                        placeholder = "Name"
                        className = "income-input"
                        value = {incomeName}
                        onChange = {(e) => setIncomeName(e.target.value)} 
                    /><br/><br/>
                    <input 
                        type = "number" 
                        placeholder = "Price"
                        className = "income-input"
                        value = {incomePrice}
                        onChange = {(e) => setIncomePrice(e.target.value)} 
                    /><br/><br/> 
                    <input 
                        type = "date" 
                        placeholder = "Date"
                        className = "income-input"
                        value = {incomeDate}
                        onChange = {(e) => setIncomeDate(e.target.value)}
                    /><br/><br/> 
                    <button className = "submit-income" onClick = {handleSubmit2}>Add</button>
                     
                </div>
            </div>
            <br/> 
            <div className = "section-two"> 
                <div className = "spendings">
                    <h2 className = "spendings-title">Spendings</h2>
                    <section> 
                        <img src = "/util.png" style = {{width: "40px", height: "40px"}} alt = ""/>
                        <h3> &nbsp;&nbsp;&nbsp;&nbsp; Utilities: ${utilities}</h3> 
                    </section>
                    <section> 
                        <img src = "/housing.png" style = {{width: "34px", height: "34px"}} alt = ""/> 
                        <h3> &nbsp;&nbsp;&nbsp;&nbsp; Housing: ${housing}</h3> 
                    </section>
                    <section> 
                        <img src = "/food.png" style = {{width: "45px", height: "45px"}} alt = ""/>
                        <h3> &nbsp;&nbsp;&nbsp;&nbsp; Food: ${food}</h3> 
                    </section>
                    <section>  
                        <img src = "/personal.png" style = {{width: "40px", height: "40px"}} alt = ""/>
                        <h3> &nbsp;&nbsp;&nbsp;&nbsp; Personal: ${personal}</h3> 
                    </section>
                </div>
                <div className = "expenses">
                    <h2 className = "expenses-title">Expenses</h2>
                    {expenses.map(expense => {
                        return (
                            <div className = "accounts" key = {nanoid()}>
                                <Account key = {expense.id} name = {expense.name} price = {expense.price} date = {expense.date}/>
                                <button className = "account-button" key = {nanoid()} onClick = {() => deleteExpense(expense.name, expense.price, expense.date)}>Delete</button> 
                                <br key = {nanoid()}/><br/> 
                            </div>
                        )
                    })} 
                </div>
                <div className = "income">
                    <h2 className = "income-title">Incomes</h2> 
                    {incomes.map(income => {
                        return (
                            <div className = "accounts" key = {nanoid()}>
                                <Account key = {income.id} name = {income.name} price = {income.price} date = {income.date}/>
                                <button className = "account-button" key = {nanoid()} onClick = {() => deleteIncome(income.name, income.price, income.date)}>Delete</button> 
                                <br key = {nanoid()}/><br/> 
                            </div>
                        )
                    })} 
                </div>
            </div>
        </div>
    )
}

export default Dashboard;