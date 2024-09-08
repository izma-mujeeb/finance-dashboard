import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
); 

function Piechart({utilCount, housingCount, foodCount, personalCount}) {
    const data = {
        labels: ["Utilities", "Housing", "Food", "Personal"],
        datasets: [
            {
                data: [utilCount, housingCount, foodCount, personalCount],
                backgroundColor: ["#177A90", "#074D5D", "#099DC0", "aqua"]
            }
        ]
    }
    const options = {

    }

    return (
        <div style = {{width: "50%", margin: "auto"}}>
            <Pie
                data = {data}
                options = {options} 
            >
            </Pie>
        </div>
    )
}

export default Piechart;