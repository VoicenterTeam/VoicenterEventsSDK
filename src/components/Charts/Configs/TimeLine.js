import Highcharts from 'highcharts'
import i18n from '@/i18n'
import config from '@/config'
import Exporting from 'highcharts/modules/exporting'
import noDataModule from 'highcharts/modules/no-data-to-display'
import { timeFormatter } from '@/helpers/timeFormatter'

Exporting(Highcharts)
noDataModule(Highcharts)

const yLineConfig = {
    gridLineDashStyle: 'longdash',
    lineWidth: 2,
    title: false,
    labels: {
        style: {
            color: config.colors.warm_grey,
            fontSize: config.fonts.base,
            format: '{value} s',
        },
    },
}

let yAxisConfig = {
    yAxis: [{
        ...yLineConfig,
    }, {
        linkedTo: 0,
        opposite: true,
        ...yLineConfig,
    }],
}

let queueChartYAxisConfig = {
    yAxis: [{
        ...yLineConfig,
        ...{ labels: { ...yLineConfig.labels, ...{ format: '{value} s' } } },
    }, {
        ...yLineConfig,
        opposite: true,
        tickInterval: 1,
    }],
}

Highcharts.setOptions({
    chart: {
        marginTop: 45,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        backgroundColor: 'transparent',
    },
    tooltip: {
        useHTML: true,
        formatter: function () {

            if (this.point.radius) {
                return false
            }
            if (this.point.stackTotal) {

                let percentage = (this.point.y * 100 / this.point.stackTotal).toFixed(2)
                let result = `<p style="text-align: center; font-size: config.fonts.base; color: ${this.point.color};">${this.series.name}</p><p style="text-align: center; margin: 5px auto;"><b>${this.point.y} Of ${this.point.stackTotal} - ${percentage} %<b></p>`

                let agents = this.point['agents']

                if (agents) {
                    result += '<div style="border-top: 1px solid;"></div>'
                    agents.forEach((agent) => {
                        result += `<p style="margin: 5px auto;"> - ${agent.userName}</p>`
                    })
                }

                return result
            }

            if (this.point.innerRadius) {
                return `${this.series.name}<br><span style="font-size:2em; color: ${this.point.color}; font-weight: bold">${this.point.y} %</span>`
            }

            if (this.point.toTime) {
                let valueToDisplay = timeFormatter(this.point.y)
                return `<p style="font-size: config.fonts.base; color: ${this.point.color};">${this.series.name}: ${valueToDisplay}</p>`
            }

            if (this.point.start && this.point.start) {
                return `<p style="font-size: config.fonts.base; color: ${this.point.color};">${this.point.name}<br> ${this.series.name} (${this.point.y})</p>`
            }

            return `<p style="font-size: config.fonts.base; color: ${this.point.color};">${this.series.name}: ${this.point.y}</p>`
        },
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        boxShadow: '0 10px 15px 0 rgba(143, 149, 163, 0.38)',
        borderRadius: 10,
    },
    colors: [
        '#2575FF',
        '#876cff',
        '#48BB78',
        '#61B5FF',
        '#003B4D',
        '#FF4D4D',
        '#ED64A6',
        '#667EEA',
        '#9F7AEA',
        '#1CBBB4',
    ],
    lang: {
        viewFullscreen: i18n.t('chart.viewFullscreen'),
        printChart: i18n.t('chart.printChart'),
        downloadJPEG: i18n.t('chart.downloadJPEG'),
        downloadPDF: i18n.t('chart.downloadPDF'),
        downloadPNG: i18n.t('chart.downloadPNG'),
        downloadSVG: i18n.t('chart.downloadSVG'),
        loading: i18n.t('chart.loading'),
        rangeSelectorZoom: '',
    },
    exporting: {
        buttons: {
            contextButton: {
                enabled: false,
            },
            printButton: {
                enabled: false
            },
            exportButton: {
                enabled: false
            },
        },
    },
    credits: {
        enabled: false,
    },
    xAxis: {
        lineWidth: 1,
        tickWidth: 0,
        lineColor: config.colors.primary,
        labels: {
            style: {
                color: config.colors.warm_grey,
                fontSize: config.fonts.base,
            }
        },
    },
    legend: {
        enabled: true,
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false,
            },
        },
    },
    title: {
        text: '',
        style: {
            color: config.colors.warm_grey,
            fontSize: config.fonts.base,
        },
    },
})

export default {
    Highcharts,
    yAxisConfig,
    queueChartYAxisConfig,
}
