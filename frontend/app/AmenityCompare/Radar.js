import { Radar } from 'react-chartjs-2';

const RadarChart = ({ amenity, compare }) => {
    const data = {
        labels: ['Essen', 'Service', 'Komfort', 'Standort', 'Value'],
        datasets: [
            {
                label: amenity.name,
                data: [amenity.averages.food, amenity.averages.service, amenity.averages.comfort, amenity.averages.location, amenity.averages.price],
                fill: true,
                backgroundColor: 'rgba(0, 180, 112, 0.2)',
                borderColor: 'rgb(0, 180, 112)',
                pointBackgroundColor: 'rgb(0, 180, 112)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(0, 180, 112)'
            },
            {
                label: compare.name,
                data: [compare.averages.food, compare.averages.service, compare.averages.comfort, compare.averages.location, compare.averages.price],
                fill: true,
                backgroundColor: 'rgba(37, 40, 64, 0.2)',
                borderColor: 'rgb(37, 40, 64)',
                pointBackgroundColor: 'rgb(37, 40, 64)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(37, 40, 64)'
            }
        ]
    };

    return <Radar data={data} />;
};

export default RadarChart;