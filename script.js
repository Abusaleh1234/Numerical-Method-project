let chart; // Declare chart variable globally

function calculateLagrange() {
    const xValues = document.getElementById('xValues').value.split(',').map(Number);
    const yValues = document.getElementById('yValues').value.split(',').map(Number);
    const specificX = parseFloat(document.getElementById('specificX').value);

    if (xValues.length !== yValues.length || xValues.length === 0) {
        alert("Please enter an equal number of x and y values.");
        return;
    }

    const n = xValues.length;

    // Lagrange interpolation function
    const lagrangePoly = (x) => {
        let result = 0;
        for (let i = 0; i < n; i++) {
            let term = yValues[i];
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
                }
            }
            result += term;
        }
        return result;
    };

    // Generate the polynomial string for display
    let polynomialString = "F(x) = ";
    for (let i = 0; i < n; i++) {
        polynomialString += `${yValues[i]}`;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                polynomialString += `(x - ${xValues[j]}) / (${xValues[i] - xValues[j]})`;
            }
        }
        if (i < n - 1) polynomialString += " + ";
    }

    document.getElementById("polynomial").textContent = polynomialString;

    // Calculate temperature for the specific time entered
    if (!isNaN(specificX)) {
        const specificY = lagrangePoly(specificX);
        document.getElementById("specificY").textContent = `Temperature at ${specificX} hours = ${specificY.toFixed(2)}°C`;
    } else {
        document.getElementById("specificY").textContent = "";
    }

    // Plotting
    const xPlot = [];
    const yPlot = [];
    for (let i = Math.min(...xValues); i <= Math.max(...xValues); i += 0.1) {
        xPlot.push(i);
        yPlot.push(lagrangePoly(i));
    }

    // Check if chart is already created
    if (chart) {
        chart.data.labels = xPlot;
        chart.data.datasets[0].data = yPlot;
        chart.update(); // Update the existing chart
    } else {
        // Create a new chart
        chart = new Chart(document.getElementById('lagrangeChart'), {
            type: 'line',
            data: {
                labels: xPlot,
                datasets: [{
                    label: 'Interpolated Temperature',
                    data: yPlot,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                },
                {
                    label: 'Temperature Data Points',
                    data: xValues.map((x, i) => ({ x, y: yValues[i] })),
                    type: 'scatter',
                    backgroundColor: 'rgb(255, 99, 132)',
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Time (hours)' } },
                    y: { title: { display: true, text: 'Temperature (°C)' } }
                }
            }
        });
    }
}
