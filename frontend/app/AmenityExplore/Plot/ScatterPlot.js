import { Scatter } from "react-chartjs-2";
import { Chart, Chartjs } from "chart.js/auto";

export default function ScatterPlot({ data, options }) {
    const updatedOptions = {
        ...options,
        legend: {
            display: false 
        },
        plugins: {
            legend: {
                display: false 
            }
        }
    };

    return <Scatter data={data} options={updatedOptions} />
}
