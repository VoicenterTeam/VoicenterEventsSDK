import Vue from 'vue'
import get from 'lodash/get';
import EventBus from '@/event-bus/EventBus';
import { sdkEventTypes } from '@/enum/sdkEvents';
import NotificationsPlugin from '@/components/NotificationPlugin';
import i18n from '@/i18n'

Vue.use(NotificationsPlugin)
const app = new Vue({})
const $notify = app.$notify

const sdkMessages = {
    missingToken: 'A token property should be provided',
    serverConnectionError: 'Could not find any server to establish connection with',
}

const parseCatch = (apiError, showAxiosErrorMessage = false, messagePrefix = '') => {
    let message;

    const responseData = get(apiError.response, 'data')
    if (responseData) {
        const responseMessage = get(responseData, 'message')
        const responseDescription = get(responseData, 'Description')
        if (responseDescription) {
            message = responseDescription
        } else if (responseMessage) {
            message = responseMessage
        }
    } else if (apiError.message) {
        message = apiError.message
    }
    let status = get(apiError, 'response.status')
    let title
    if (status === 401) {
        message = i18n.t('invalid.token.message')
        title = i18n.t('invalid.token.title')
    }
    if (message === sdkMessages.serverConnectionError) {
        title = i18n.t('errors.realtime.connection.title')
        message = i18n.t('errors.realtime.connection.message')
    }
    
    if (showAxiosErrorMessage && message && shouldDisplayNotification(apiError)) {
        const messageConfig = {
            title,
            message: `${messagePrefix} ${message}`,
        }
        $notify({
            type: 'danger',
            icon: true,
            ...messageConfig,
            
        })

        throw new Error(apiError)
    }
};

EventBus.$on(sdkEventTypes.CONNECT_ERROR, () => {
    $notify({
        type: 'danger',
        icon: true,
        title: 'errors.realtime.connection.title',
        message: 'errors.realtime.connection.message2',
    })
})
EventBus.$on(sdkEventTypes.CONNECT_TIMEOUT, () => {
    $notify({
        type: 'danger',
        icon: true,
        title: 'errors.realtime.timeout.title',
        message: 'errors.realtime.timeout.description',
    })
})
const messagesToSkip = [sdkMessages.missingToken, 'Network Error'] // These are already handled in other places

function shouldDisplayNotification(apiError) {
    return !messagesToSkip.includes(apiError.message)
}

export default parseCatch
