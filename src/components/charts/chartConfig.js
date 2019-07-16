import Highcharts from 'highcharts'
import noDataModule from 'highcharts/modules/no-data-to-display'
import Exporting from 'highcharts/modules/exporting'
import config from '@/config'
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
    legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        floating: true,
        y: -7,
    },
    navigator: {
        enabled: false,
    },
})

export default {
    Highcharts,
    zoom: {
        enabled: true,
        inputEnabled: true,
        buttonPosition: {
            align: 'left',
        },
        buttons: [
            {
                type: 'day',
                count: 1,
                text: 'Today'
            },
            {
                type: 'day',
                count: 7,
                text: 'Last Week'
            },
            {
                type: 'day',
                count: 30,
                text: 'Last Month'
            },
            {
                type: 'day',
                count: 364,
                text: 'Last Year'
            },
            {
                type: 'all',
                text: 'All'
            },
        ],
        buttonTheme: {
            width: '80px',
            padding: 4,
            style: {
                color: config.colors.info,
            },
            states: {
                select: {
                    fill: config.colors.info,
                    style: {
                        color: 'white',
                    }
                }
            }
        },
        inputStyle: {
            color: config.colors.info
        },
        labelStyle: {
            display: 'block',
            color: config.colors.gray,
        },
        selected: 4
    },
}
