const PARAM_NAME = 'AppDataParamName'
const PARAM_KEY = 'AppDataJsonPath'

export const wizardDynamicSummaryMixin = {
    data() {
        return {
            allParameters: {}
        }
    },
    methods: {
        getDynamicSummaryLabel(param) {
            const labelData = this.allParameters[param]
            return labelData ? `${labelData[PARAM_NAME]}:` : `${param}:`
        },
        setAllParameters(params, paramKey = PARAM_KEY) {
            params.forEach(parameter => {
                const key = parameter[paramKey].slice(2);
                this.allParameters[key] = parameter
            })
        }
    }
}
