import ReactDOM from 'react-dom/client';
import './index.css';
import Login from "./components/Login.js";
import Dashboard from './components/Dashboard.js';
import Signup from './components/Signup.js';
import {BrowserRouter, Routes, Route} from "react-router-dom" 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route index element = {<Login/>}></Route>
            <Route path = "dashboard/:username" element = {<Dashboard/>}></Route>
            <Route path = "signup" element = {<Signup/>}></Route>
            <Route path = "login" element = {<Login/>}></Route>
        </Routes>
    </BrowserRouter>
);


