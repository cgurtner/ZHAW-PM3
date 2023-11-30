import { Scatter } from "react-chartjs-2";
import { Chart, Chartjs } from "chart.js/auto";

export default function ScatterPlot() {
    const data = {
        datasets: [
            {
                label: 'Scatter Dataset',
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 6,
                pointHitRadius: 10,
                data: [
                    { x: 65, y: 75 },
                    { x: 59, y: 49 },
                    { x: 80, y: 90 },
                    { x: 81, y: 29 },
                    { x: 56, y: 36 },
                    { x: 55, y: 25 },
                    { x: 40, y: 18 },
                ],
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
            },
        },
    };

    return <Scatter data={data} options={options} />
}