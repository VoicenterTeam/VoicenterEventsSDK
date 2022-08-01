import statusTypes from "@/enum/statusTypes";
import store from '@/store/store'

const { inCall } = store.getters['layout/colors']('activeLayout')

export const extensionColor = (extension) => {
    let data = statusTypes[extension.representativeStatus] || {color: 'white'}
    let color = data.color
    if (extension.calls.length) {
        color = inCall
    }
    return color
};
