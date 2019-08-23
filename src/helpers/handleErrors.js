import {Notification} from 'element-ui';

const parseCatch = (apiError, showAxiosErrorMessage = false) => {
    let message;

    if (apiError.response && apiError.response.data) {
        message = apiError.response.data.message
    }

    if (showAxiosErrorMessage && message) {
        Notification.error(message);
    }
};

export default parseCatch;
