import Highcharts from "highcharts";

export function renderIcons(series) {
    // Move icon
    if (!series[0].icon) {
        series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
            .attr({
                stroke: '#303030',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                zIndex: 10
            })
            .add(series[2].group);
    }
    series[0].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - series[0].points[0].shapeArgs.innerR -
        (series[0].points[0].shapeArgs.r - series[0].points[0].shapeArgs.innerR) / 2
    );

    // Exercise icon
    if (!series[1].icon) {
        series[1].icon = this.renderer.path(
            ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                'M', 8, -8, 'L', 16, 0, 8, 8]
        )
            .attr({
                stroke: '#ffffff',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                zIndex: 10
            })
            .add(series[2].group);
    }
    series[1].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - series[1].points[0].shapeArgs.innerR -
        (series[1].points[0].shapeArgs.r - series[1].points[0].shapeArgs.innerR) / 2
    );

    // Stand icon
    if (!series[2].icon) {
        series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
            .attr({
                stroke: '#303030',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                zIndex: 10
            })
            .add(series[2].group);
    }

    series[2].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - series[2].points[0].shapeArgs.innerR -
        (series[2].points[0].shapeArgs.r - series[2].points[0].shapeArgs.innerR) / 2
    );
}

export default {
    chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
    },
    tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        valueSuffix: '%',
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y %}%</span>',
        positioner: function (labelWidth) {
            return {
                x: (this.chart.chartWidth - labelWidth) / 2,
                y: (this.chart.plotHeight / 2) + 15
            };
        }
    },
    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },
}
