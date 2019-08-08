import Highcharts from 'highcharts'
import noDataModule from 'highcharts/modules/no-data-to-display'
import Exporting from 'highcharts/modules/exporting'
import i18n from '@/i18n'
import config from "../../config";

Exporting(Highcharts)

noDataModule(Highcharts)

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

Highcharts.setOptions({
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
                y: -10,
                menuItems: [
                    "printChart",
                    "separator",
                    "downloadPNG",
                    "downloadJPEG",
                    "downloadPDF",
                    "downloadSVG"
                ],
                theme: {}
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
    title: {
        align: 'left',
        style: {
            color: config.colors.charcoal_grey,
            fontSize: '18px'
        }
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
})

export default {
    Highcharts,
}
