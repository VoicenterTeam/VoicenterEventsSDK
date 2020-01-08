import get from 'lodash/get'
import store from '../store/store'
import {filters} from '../enum/widgetTemplateConfigs'

export function getOptionsList(ParameterID) {
    let templateConfig = getTemplateConfig(ParameterID)
    let EntitiesListKey = get(templateConfig, 'EntitiesListKey')
    return store.getters['entities/getEntityList'](EntitiesListKey)
}

export function getTemplateConfig(ParameterID) {
    return filters[ParameterID]
}

export function getOptionsValues(ParameterID) {
    let options = getOptionsList(ParameterID)

    if (!options) return;

    let templateConfig = getTemplateConfig(ParameterID)

    options = options.map(el => {
        //templateConfig.value = key for value
        return Number(el[templateConfig.value]);
    });
    return options
}
