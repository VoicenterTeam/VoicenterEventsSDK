import statusTypes from "@/enum/statusTypes";
import colors from '@/enum/colors'

export const extensionColor = (extension) => {
    let data = statusTypes[extension.representativeStatus] || {color: 'white'}
    let color = data.color
    if (extension.calls.length) {
        color = colors.LIGHT_GREEN
    }
    return color
};
