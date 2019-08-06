import Highcharts from 'highcharts'
import noDataModule from 'highcharts/modules/no-data-to-display'
import Exporting from 'highcharts/modules/exporting'
import i18n from '@/i18n'

Exporting(Highcharts)

noDataModule(Highcharts)

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
    },
    yAxis: [
        {
            lineWidth: 1,
            title: false,
            gridLineDashStyle: 'longdash',
        }, {

            lineWidth: 1,
            title: false,
            linkedTo: 0,
            opposite: true,
            gridLineDashStyle: 'longdash',
        }
    ],
    legend: {
        enabled: false
    },
})

export default {
    Highcharts,
}
