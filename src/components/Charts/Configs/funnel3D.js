export default {
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: `<b>{point.name}</b> ({point.y:,.0f})`,
                allowOverlap: true,
                y: 10
            },
            neckWidth: "30%",
            neckHeight: "25%",
            width: "80%",
            height: "80%"
        }
    },
    chart: {
        type: 'funnel3d',
        options3d: {
            enabled: true,
            alpha: 10,
            depth: 50,
            viewDistance: 50,
        },
    },
}
