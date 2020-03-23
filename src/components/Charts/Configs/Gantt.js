import Highcharts from "highcharts";

export const buttonConfigs = {
    buttons: {
        contextButton: {
            enabled: false,
        },
        exportButton: {
            text: '...',
            align: 'left',
            y: -8,
            x: 30,
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
            align: 'left',
            symbol: 'url(/img/IconFullScreen.svg)',
            y: -7,
            x: 0,
            symbolX: 19,
            symbolY: 19,
            onclick: function () {
                Highcharts.FullScreen.prototype.init(this.renderTo);
            },
        },
    }
}
