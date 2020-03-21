import Highcharts from 'highcharts'
import i18n from '@/i18n'
import config from '@/config'
import Exporting from 'highcharts/modules/exporting'
import noDataModule from 'highcharts/modules/no-data-to-display'
import {format} from "date-fns";

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
            format: "{value} s"
        }
    }
}

let yAxisConfig = {
    yAxis: [{
        ...yLineConfig
    }, {
        linkedTo: 0,
        opposite: true,
        ...yLineConfig
    }]
}

let queueChartYAxisConfig = {
    yAxis: [{
        ...yLineConfig,
        ...{labels: {...yLineConfig.labels, ...{format: '{value} s'}}}
    }, {
        ...yLineConfig,
        opposite: true,
        tickInterval: 1
    }]
}

Highcharts.setOptions({
    chart: {
        marginTop: 45,
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        backgroundColor: 'transparent'
    },
    tooltip: {
        formatter: function () {
            if (this.point.stackTotal) {
                let percentage = (this.point.y * 100 / this.point.stackTotal).toFixed(2)
                return `<p style="font-size: config.fonts.base; color: ${this.point.color}; margin-top: 10px;">${this.series.name}</p> <br><p style="text-align: center;"><b>${this.point.y} Of ${this.point.stackTotal} - ${percentage} %<b></p>`
            }
            if (this.point.innerRadius) {
                return `${this.series.name}<br><span style="font-size:2em; color: ${this.point.color}; font-weight: bold">${this.point.y} %</span>`
            }

            if (this.point.start && this.point.start) {
                let date = format(this.point.start * 1000, 'MM-dd-yyyy HH:mm:ss')
                return `<p>${date}</p><br><p style="font-size: config.fonts.base; color: ${this.point.color}; margin-top: 10px">${this.series.name}: ${this.point.y}</p>`
            }

            return `<p style="font-size: config.fonts.base; color: ${this.point.color}; margin-top: 10px">${this.series.name}: ${this.point.y}</p>`
        },
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        boxShadow: "0 10px 15px 0 rgba(143, 149, 163, 0.38)",
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
        '#1CBBB4'
    ],
    lang: {
        viewFullscreen: i18n.t('chart.viewFullscreen'),
        printChart: i18n.t('chart.printChart'),
        downloadJPEG: i18n.t('chart.downloadJPEG'),
        downloadPDF: i18n.t('chart.downloadPDF'),
        downloadPNG: i18n.t('chart.downloadPNG'),
        downloadSVG: i18n.t('chart.downloadSVG'),
        loading: i18n.t('chart.loading'),
        rangeSelectorZoom: ''
    },
    exporting: {
        buttons: {
            contextButton: {
                enabled: false,
            },
            exportButton: {
                text: '...',
                align: 'right',
                y: -8,
                x: 7,
                symbolX: 10,
                symbolY: 10,
                menuItems: [
                    "printChart",
                    "separator",
                    "downloadPNG",
                    "downloadJPEG",
                    "downloadPDF",
                    "downloadSVG"
                ],
                theme: {
                    states: {
                        'stroke-width': 1,
                        stroke: 'silver',
                        r: 0,
                        hover: {
                            fill: 'white'
                        },
                        select: {
                            fill: 'white'
                        }
                    }
                }
            },
            viewFullscreen: {
                symbol: 'url(/img/IconFullScreen.svg)',
                y: -7,
                x: -18,
                symbolX: 19,
                symbolY: 19,
                onclick: function () {
                    Highcharts.FullScreen.prototype.init(this.renderTo);
                },
            },
        }
    },
    credits: {
        enabled: false
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
        enabled: false
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        },
    },
    title: {
        text: '',
        style: {
            color: config.colors.warm_grey,
            fontSize: config.fonts.base,
        }
    }
})

export default {
    Highcharts,
    yAxisConfig,
    queueChartYAxisConfig,
}
