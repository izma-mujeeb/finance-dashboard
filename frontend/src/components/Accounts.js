import React from "react";
import {nanoid} from "nanoid";

function Account({name, price, date}) {
    const mystyle = {
        color: "#17798F",
        fontWeight: "bold",
    }
    return (
        <div className = "expense" key = {nanoid()}>
            <span key = {nanoid()}>
                <span style = {mystyle}>  Name: </span> {name} 
                <span style = {mystyle}>  Price: </span> {price} 
                <span style = {mystyle}>  Date: </span> {date}
            </span>
        </div>
    )
}

export default Account; 