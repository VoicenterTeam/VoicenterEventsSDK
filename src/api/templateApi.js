import store from '@/store/store'
import $axios from './apiConnection'
import parseCatch from '@/helpers/handleErrors'

function getCurrentLanguageID() {
    return store.getters['lang/getLanguageID']
}

export const templateApi = {
    async getTemplateCategories() {
        try {
            let { CategoryList } = await $axios.post('TemplatesCategory/CategoryList/', {})
            return CategoryList
        } catch (e) {
            parseCatch(e, true, 'Get Templates Category')
        }
    },
    async getDashboardTemplates() {
        try {
            const LanguageID = getCurrentLanguageID()
            const { DashboardTemplateCategoryList } = await $axios.get(`DashboardTemplate/DashboardTemplateList/${LanguageID}`)
            return DashboardTemplateCategoryList
        } catch (e) {
            parseCatch(e, true, 'Get Dashboard Templates')
            const { DashboardTemplateCategoryList } = await $axios.get('DashboardTemplate/DashboardTemplateList/1')
            return DashboardTemplateCategoryList
        }
    },
    async getHelpByWidgetsTemplateID(templateID, LanguageID) {
        try {
            const { DashboardTemplateCategoryList } = await $axios.get(`DashboardTemplate/DashboardTemplateList/${templateID}/${LanguageID}`)
            return DashboardTemplateCategoryList
        } catch (e) {
            parseCatch(e, true, 'Template Dictionary')
        }
    },
    async getWidgetsTemplateHelps() {
        try {
            const LanguageID = getCurrentLanguageID()
            const { Data } = await $axios.get(`WidgetsTemplate/Help/${LanguageID}`)
            return Data
        } catch (e) {
            parseCatch(e, true, 'Template Helps')
        }
    },
}
