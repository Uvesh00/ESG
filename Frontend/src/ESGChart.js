import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function ESGChart({ data }) {
    if (!data) {
        return <p>No ESG data available to display.</p>; // Handle the case when data is undefined
    }

    const chartData = {
        labels: ['Overall Score', 'Environmental', 'Social', 'Governance'],
        datasets: [
            {
                label: 'ESG Scores',
                data: [
                    data['Overall Score'] || 0,
                    data['Environmental Pillar Score'] || 0,
                    data['Social Pillar Score'] || 0,
                    data['Governance Pillar Score'] || 0,
                ],
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
            },
        ],
    };

    return <Bar data={chartData} />;
}

export default ESGChart;
