import get from 'lodash/get'
import store from '../store/store'
import {filters} from '../enum/widgetTemplateConfigs'

export function getOptionsList(ParameterName) {
    let templateConfig = getTemplateConfig(ParameterName)
    let EntitiesListKey = get(templateConfig, 'EntitiesListKey')
    return store.getters['entities/getEntityList'](EntitiesListKey)
}

export function getTemplateConfig(ParameterName) {
    return filters[ParameterName]
}

export function getOptionsValues(ParameterName) {
    let options = getOptionsList(ParameterName)

    if (!options) return;

    let templateConfig = getTemplateConfig(ParameterName)

    options = options.map(el => {
        //templateConfig.value = key for value
        return Number(el[templateConfig.value]);
    });
    return options
}
