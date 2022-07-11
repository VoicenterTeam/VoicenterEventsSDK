import { Notification } from 'element-ui'

export default {
    call (data) {
        Notification({
            dangerouslyUseHTMLString: true,
            title: data.title,
            message: `
                <span class="simple-notification-container">
                    <div>
                        <i class="simple-notification-container--icon el-icon-${data.type}"></i>
                    </div>
                    <div class="mx-2">
                        <span class="simple-notification-container--message">${data.message}</span>
                    </div>
                </span>
            `
        })
    }
}