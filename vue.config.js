module.exports = {
    devServer: {
        https: true,
        port: 443,
        host: 'dashboarddev.voicenter.co' // dashboarddev2.voicenter.co - for hebrew
    },
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader');
    },

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
    css: {
        // Enable CSS source maps.
        sourceMap: process.env.NODE_ENV === 'development'
    }
};
