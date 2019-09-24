import Highcharts from 'highcharts'
import i18n from '@/i18n'
import config from "../../config";

const yLineConfig = {
    gridLineDashStyle: 'longdash',
    lineWidth: 2,
    title: false,
    labels: {
        style: {
            color: config.colors.warm_grey,
            fontSize: "16px"
        }
    },
}

let chartConfig = {
    chart: {
        marginTop: 45
    },
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
                y: -12,
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
    yAxis: [{
        ...yLineConfig
    }, {
        linkedTo: 0,
        opposite: true,
        ...yLineConfig
    }],
    xAxis: {
        lineWidth: 1,
        tickWidth: 0,
        lineColor: config.colors.primary,
        labels: {
            style: {
                color: config.colors.warm_grey,
                fontSize: "16px",
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
}

export default chartConfig
