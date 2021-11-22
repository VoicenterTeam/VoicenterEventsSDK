import Notifications from './Notifications.vue';
import NotificationEditLink from './NotificationEditLink';

const NotificationStore = {
    state: [], // here the notifications will be added
    settings: {
        overlap: false,
        verticalAlign: 'top',
        horizontalAlign: 'right',
        type: 'info',
        timeout: 3000,
        closeOnClick: true,
        showClose: true
    },
    openEditSettings: {
        type: 'success',
        icon: true,
        timeout: 5000,
    },
    setOptions(options) {
        this.settings = Object.assign(this.settings, options);
    },
    removeNotification(timestamp) {
        const indexToDelete = this.state.findIndex(n => n.timestamp === timestamp);
        if (indexToDelete !== -1) {
            this.state.splice(indexToDelete, 1);
        }
    },
    addNotification(notification) {
        if (typeof notification === 'string' || notification instanceof String) {
            notification = {message: notification};
        }
        notification.timestamp = new Date();
        notification.timestamp.setMilliseconds(
            notification.timestamp.getMilliseconds() + this.state.length
        );
        notification = Object.assign({}, this.settings, notification);
        this.state.push(notification);
    },
    notify(notification) {
        if (Array.isArray(notification)) {
            notification.forEach(notificationInstance => {
                this.addNotification(notificationInstance);
            });
        } else {
            this.addNotification(notification);
        }
    }
};

const NotificationsPlugin = {
    install(Vue, options) {
        let app = new Vue({
            data: {
                notificationStore: NotificationStore
            },
            components: {
                NotificationEditLink
            },
            methods: {
                notify(notification) {
                    const mode = notification.mode || 'default';

                    let notificationOptions = notification;

                    if (mode === 'edit') {
                        const {
                            createdElId,
                            idKey = 'Id',
                            openCreatedTab,
                            entity
                        } = notification;

                        notificationOptions = {
                            ...this.notificationStore.openEditSettings,
                            component: {
                                render: function (h) {
                                    return h(NotificationEditLink, {
                                            props: {
                                                entity
                                            },
                                            on: {
                                                click: () => {
                                                    openCreatedTab(idKey, createdElId)
                                                }
                                            }
                                        }
                                    )
                                }
                            },
                            ...notification
                        }
                    }

                    this.notificationStore.notify(notificationOptions)
                }
            }
        });
        Vue.prototype.$notify = app.notify;
        Vue.prototype.$notifications = app.notificationStore;
        Vue.component('Notifications', Notifications);
        if (options) {
            NotificationStore.setOptions(options);
        }
    }
};

export default NotificationsPlugin;
