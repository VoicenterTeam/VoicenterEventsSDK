import i18n from '@/i18n'

export function realTimeWidgetRules (model) {
    return {
        'settings.generalThresholdLowValue': [
            {
                min: model.settings.generalThreshold ? 1 : 0,
                type: 'number',
                message: i18n.t('validation.generalThresholdLowValue'),
            }
        ],
        'settings.generalThresholdHeightValue': [
            {
                min: model.settings.generalThreshold ? (model.settings.generalThresholdLowValue + 1) : 0,
                type: 'number',
                message: i18n.t('validation.generalThresholdHeightValue'),
            }
        ],
        'settings.callThresholdLowValue': [
            {
                min: model.settings.callThreshold ? 1 : 0,
                type: 'number',
                message: i18n.t('validation.callThresholdLowValue'),
            }
        ],
        'settings.callThresholdHeightValue': [
            {
                min: model.settings.callThreshold ? (model.settings.callThresholdLowValue + 1) : 0,
                type: 'number',
                message: i18n.t('validation.callThresholdHeightValue'),
            }
        ],
    }
}
