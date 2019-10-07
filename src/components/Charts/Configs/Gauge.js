export default {
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
        tickInterval: false,
        startOnTick: true,
        lineWidth: 0,
        minorTickInterval: null,
        tickWidth: 0,
        title: {
            y: -70
        },
        labels: {
            y: 16
        },
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
    series: [{
        dataLabels: {
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:22px">kb/s</span><br/><br/>' +
                '<span style="font-size:20px;opacity:0.4;">{y:.1f}</span>' +
                '</div>',
            y: -65
        }
    }]
}
