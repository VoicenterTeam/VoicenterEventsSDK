import {Notification} from 'element-ui';
import get from 'lodash/get';
import i18n from "@/i18n";
import EventBus from "@/event-bus/EventBus";
import { sdkEventTypes } from "@/enum/sdkEvents";
const sdkMessages = {
    missingToken: 'A token property should be provided',
    serverConnectionError: 'Could not find any server to establish connection with'
}

const parseCatch = (apiError, showAxiosErrorMessage = false, messagePrefix = '') => {
    let message;

    if (get(apiError.response, 'data')) {
        message = apiError.response.data.message
    } else if (apiError.message) {
        message = apiError.message
    }
    let status = get(apiError, 'response.status')
    let title
    if (status === 401) {
        message = i18n.t('invalid.token')
        title = i18n.t('invalid.token.title')
    }
    if (message === sdkMessages.serverConnectionError) {
        title = i18n.t('errors.realtime.connection.title')
        message = i18n.t('errors.realtime.connection.message')
    }
    if (showAxiosErrorMessage && message && shouldDisplayNotification(apiError)) {
        const messageConfig = {
            message: `${messagePrefix} ${message}`,
            title
        }
        Notification.error(messageConfig);
    }
};

EventBus.$on(sdkEventTypes.CONNECT_ERROR, () => {
    Notification.error({
        title: i18n.t('errors.realtime.connection.title'),
        message: i18n.t('errors.realtime.connection.message2')
    });
})
EventBus.$on(sdkEventTypes.CONNECT_TIMEOUT, () => {
    Notification.error({
        title: i18n.t('errors.realtime.timeout.title'),
        message: i18n.t('errors.realtime.timeout.description')
    });
})
const messagesToSkip = [sdkMessages.missingToken, 'Network Error'] // These are already handled in other places
function shouldDisplayNotification(apiError) {
    return !messagesToSkip.includes(apiError.message)
}

export default parseCatch;
