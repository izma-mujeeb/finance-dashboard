import {React, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import "../index.css"

let loginExists = true;

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); 
    const [noAccount, setNoAccount] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "#E0F3F7";
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        noLoginAccount();   
    }

    async function noLoginAccount() {
        let result = await fetch("http://localhost:4000/getUsers", {
            method: "GET"
        })
        result = await result.json();
        loginExists = result.some(res => res.username === username && res.password === password);
        if (!loginExists) {
            setNoAccount(true);
        } else {
            setNoAccount(false);
            navigate(`/dashboard/${username}`, {state: {username: username}}) 
        }
    }
    
    return (
        <>
            <h1 className = "login-title">Income Management</h1><br/><br/> 
            <div className = "login-container">
                <section className = "login-main">
                    <h2 className = "login-heading">Login</h2>  
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
                    {noAccount && <h2 style = {{fontSize: "0.8rem", color: "white", fontFamily: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"}}>Account does not exist. Please sign-up.</h2>}
                    <button className = "login-submit" onClick = {handleSubmit}>Login</button>
                </section>
                <section className = "no-account">
                    <h2>Welcome to login</h2><br/>
                    <h3>Don't have an Account?</h3><br/><br/>  
                    <Link className = "no-account-sign" to = "/signup">Sign-up</Link>
                </section>
            </div>
        </>
    )
}

export default Login;