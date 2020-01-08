import store from '../store/store'
import {filters} from '../enum/widgetTemplateConfigs'

export function getOptionsList(ParameterID) {
    let templateConfig = getTemplateConfig(ParameterID)
    return store.getters['entities/getEntityList'](templateConfig.EntitiesListKey)
}

export function getTemplateConfig(ParameterID) {
    return filters[ParameterID]
}

export function getOptionsValues(ParameterID) {
    let options = getOptionsList(ParameterID)
    let templateConfig = getTemplateConfig(ParameterID)

    options = options.map(el => {
        //templateConfig.value = key for value
        return Number(el[templateConfig.value]);
    });
    return options
}
