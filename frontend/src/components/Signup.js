import {React, useEffect, useState} from "react";
import "../index.css"
import { Link, useNavigate } from "react-router-dom";

let checkLogin = false;
let checkUsername = false;

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginExists, setLoginExists] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "#E0F3F7";
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        await alreadySignedUp(); 
        if (checkLogin || checkUsername) return;
        let result = await fetch("http://localhost:4000/signup", {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {
                "Content-Type": "application/json"
            },
        });
        result = await result.json();  
        localStorage.setItem("users", JSON.stringify(result));
    }

    async function alreadySignedUp() {
        let result = await fetch("http://localhost:4000/getUsers", {
            method: "GET"
        })
        result = await result.json();
        checkLogin = result.some(res => res.username === username && res.password === password);
        checkUsername = result.some(res => res.username === username); 
        if (checkLogin) {
            setLoginExists(true);
            setUsernameExists(false);
        } else if (checkUsername) {
            setUsernameExists(true);
            setLoginExists(false);
        } else {
            setLoginExists(false);
            setUsernameExists(false);
            navigate("/login");
        }
    }
    
    return (
        <>
            <h1 className = "login-title">Income Management</h1><br/><br/> 
            <div className = "login-container">
                <section className = "login-main">
                    <h2 className = "login-heading">Sign-up</h2>  
                    <input 
                        type = "text" 
                        placeholder = "Username"  
                        className = "login-input" 
                        value = {username} 
                        onChange = {(e) => setUsername(e.target.value)}
                    /><br/><br/>  
                    <input 
                        type = "password"  
                        placeholder = "Password" 
                        className = "login-input" 
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                    /><br/><br/> 
                    {loginExists && <h2 style = {{fontSize: "0.8rem", color: "white", fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"}}>You already have an account. Please login</h2>}
                    {usernameExists && <h2 style = {{fontSize: "0.8rem", color: "white", fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"}}>Username already exists. Please choose another one</h2>}
                    <button className = "login-submit" onClick = {handleSubmit}>Submit</button>
                </section>
                <section className = "no-account">
                    <h2>Welcome to Sign-up</h2><br/>
                    <h3>Already have an Account?</h3><br/><br/> 
                    <Link className = "no-account-sign" to = "/login">Login</Link>
                </section>
            </div>
        </>
    )
}

export default Signup;