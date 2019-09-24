const configs = {
    chart: {
        type: 'solidgauge',
    },
    pane: {
        center: ['50%', '85%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: '#EEEE',
            innerRadius: '80%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    tooltip: {
        enabled: false
    },
    yAxis: {
        stops: [
            [0.1, '#55BF3B'],
            [0.4, '#DDDF0D'],
            [0.6, '#DF5353']
        ],
        minorTickInterval: null,
        labels: {
            y: 16
        },
        tickPixelInterval: 400,
        tickWidth: 0,
        gridLineWidth: 0,
        gridLineColor: 'transparent',
    },
    plotOptions: {
        solidgauge: {
            innerRadius: '80%',
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    credits: {
        enabled: false
    },
}

export default configs
