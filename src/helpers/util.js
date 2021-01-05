import { EXTENSION_LIST_PARAMETER_NAME, USER_LIST_PARAMETER_NAME } from '@/enum/widgetTemplateConfigs'
import get from 'lodash/get'
import i18n from '@/i18n'

export function capitalizeFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getBase64 (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function getMinValue (data, key) {
    return data.reduce((min, object) => Math.min(min, object[key]), data[0][key]);
}

export function mapOrder (array, order, key) {
    array.sort(function (a, b) {
        let A = a[key]
        let B = b[key]

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }
    })
    return array
}

export function makeRandomID (length = 12) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const ADMIN_USER_ID = 71459
const ADMIN_USER_NAME = i18n.t('Admin User שירות לקוחות')

export const ADMIN_USER_EXTENSION_CONFIG = {
    ext_name: ADMIN_USER_NAME,
    extension_id: ADMIN_USER_ID,
}

export function displayUsersRelatedWithAdmin (widgetConfig) {
    const userListConfig = widgetConfig.filter(config => config.ParameterName && config.ParameterName.toLowerCase() === USER_LIST_PARAMETER_NAME || config.ParameterName.toLowerCase() === EXTENSION_LIST_PARAMETER_NAME)
    const entityPositive = get(userListConfig, '[0].WidgetParameterValueJson.EntityPositive', [])
    return entityPositive.includes(ADMIN_USER_ID)
}
