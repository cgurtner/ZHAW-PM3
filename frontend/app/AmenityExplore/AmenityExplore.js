import ScatterPlot from "./Plot/ScatterPlot";

export default function AmenityCompare({ selectedAmenityData, amenitiesData }) {
    const defaultColor = 'rgba(75,192,192,0.5)';
    const highlightColor = 'rgba(255,99,132,1)';

    const categories = ['Food', 'Service', 'Comfort', 'Location', 'Price'];
    const categoriesLabels = ['Essen', 'Service', 'Komfort', 'Standort', 'Value'];

    const scatterData = {
        datasets: amenitiesData.map(amenity => ({
            label: amenity.name,
            fill: false,
            backgroundColor: amenity.id === selectedAmenityData.id ? highlightColor : defaultColor,
            pointBorderColor: amenity.id === selectedAmenityData.id ? highlightColor : defaultColor,
            pointBackgroundColor: amenity.id === selectedAmenityData.id ? highlightColor : defaultColor, // Fill datapoint
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: amenity.id === selectedAmenityData.id ? highlightColor : defaultColor,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 6,
            pointHitRadius: 10,
            data: categories.map((category, index) => ({
                x: categoriesLabels[index], 
                y: amenity.averages[category.toLowerCase()]
            }))
        }))
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                labels: categoriesLabels
            },
            y: {
                beginAtZero: true
            }
        },
        legend: {
            display: false
        }
    };

    return <div className="mb-1.5">
        <ScatterPlot data={scatterData} options={chartOptions} />
    </div>
}
