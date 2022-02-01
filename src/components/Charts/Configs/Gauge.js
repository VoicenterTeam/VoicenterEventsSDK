export default {
    chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        height: '180px',
        marginTop: 10
    },
    pane: {
        center: ['50%', '95%'],
        size: '180%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: '#EEEE',
            innerRadius: '50%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    tooltip: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    legend: {
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
            innerRadius: '50%',
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
