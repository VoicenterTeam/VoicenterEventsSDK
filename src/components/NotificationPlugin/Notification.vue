<template>
    <div data-notify="container"
         class="alert open flex items-center md:px-4 py-5 sm:px-8"
         :class="[
          verticalAlign,
          horizontalAlign,
          {'border-primary': type ==='primary' || type === 'info'},
          {'border-green': type ==='success'},
          {'border-orange': type ==='warning'},
          {'border-red': type ==='danger'},
          {'fixed': position ==='fixed'},
          {'relative': position ==='relative'},
        ]"
         role="alert"
         :style="customPositionStyle"
         data-notify-position="top-center">
        <IconCloseBtn v-if="showClose"
                      class="h-3 text-gray-700 absolute top-0 right-0 m-4 cursor-pointer"
                      @click="close"/>
        
        <component class="h-8 mr-6 my-1 ml-1" v-if="hasIcon"
                   :is="iconType"
                   :class="{
                    'text-primary': type ==='primary' || type === 'info',
                    'text-green': type ==='success',
                    'text-orange': type ==='warning',
                    'text-red': type ==='danger',
                }"/>
        <span>
                <span class="text-base font-bold text-gray leading-tight truncate">
                  <div>{{ titleMessage }}<br/></div>
                </span>
                <span v-if="message" v-html="getMessage"/>
                <content-render
                    v-if="!message && component &&!customContent"
                    :component="component"
                />
                 <div class="w-full" :class="customContentClass"
                      v-if="customContent" v-html="getCustomContent"/>
            </span>
    </div>
</template>
<script>
    import get from 'lodash/get'
    
    export default {
        name: 'notification',
        components: {
            contentRender: {
                props: ['component'],
                render: function (h) {
                    return h(this.component)
                },
            },
        },
        props: {
            message: String,
            title: String,
            customIcon: String,
            customContent: String,
            customContentClass: String,
            verticalAlign: {
                type: String,
                default: 'top',
                validator: value => {
                    let acceptedValues = ['top', 'bottom'];
                    return acceptedValues.indexOf(value) !== -1;
                },
            },
            horizontalAlign: {
                type: String,
                default: 'right',
                validator: value => {
                    let acceptedValues = ['left', 'center', 'right'];
                    return acceptedValues.indexOf(value) !== -1;
                },
            },
            type: {
                type: String,
                default: 'info',
                validator: value => {
                    let acceptedValues = [
                        'info',
                        'primary',
                        'danger',
                        'warning',
                        'success',
                    ];
                    return acceptedValues.indexOf(value) !== -1;
                },
            },
            timeout: {
                type: Number,
                default: 5000,
                validator: value => {
                    return value >= 0;
                },
            },
            timestamp: {
                type: Date,
                default: () => new Date(),
            },
            component: {
                type: [Object, Function],
            },
            position: {
                type: String,
                default: 'fixed',
            },
            customPosition: {
                type: [Object, String],
                default: () => {
                    return {}
                },
                description: ' \'default\' | {} | custom position styles, example: {top: \'10px\'} ',
            },
            showClose: {
                type: Boolean,
                default: true,
            },
            icon: {
                type: Boolean,
                default: false,
            },
            closeOnClick: {
                type: Boolean,
                default: true,
            },
            clickHandler: Function,
        },
        data() {
            return {
                elmHeight: 0,
            };
        },
        computed: {
            iconType() {
                if (get(this.customIcon, 'length', 0)) {
                    return this.customIcon
                }
                
                if (this.type === 'success') {
                    return 'IconCheck'
                } else if (this.type === 'danger') {
                    return 'IconCloseOutline'
                }
                return 'IconInfo'
            },
            getCustomContent() {
                return this.$t(this.customContent)
            },
            getMessage() {
                return this.$t(this.message)
            },
            titleMessage() {
                if (this.title) {
                    return this.$t(this.title)
                }
                
                return this.$t(`general.notification.${this.type}`)
                
            },
            hasIcon() {
                return this.icon || get(this.customIcon, 'length', 0);
            },
            customPositionStyle() {
                let styles = {};
                if (this.customPosition !== 'default') {
                    let initialMargin = 20;
                    let alertHeight = this.elmHeight + 10;
                    let sameAlertsCount = this.$notifications.state.filter(alert => {
                        return (
                            alert.horizontalAlign === this.horizontalAlign &&
                            alert.verticalAlign === this.verticalAlign &&
                            alert.timestamp <= this.timestamp
                        );
                    }).length;
                    if (this.$notifications.settings.overlap) {
                        sameAlertsCount = 1;
                    }
                    let pixels = (sameAlertsCount - 1) * alertHeight + initialMargin;
                    if (this.verticalAlign === 'top') {
                        styles.top = `${pixels}px`;
                    } else {
                        styles.bottom = `${pixels}px`;
                    }
                    if (Object.keys(this.customPosition).length) {
                        styles = {
                            ...styles,
                            ...this.customPosition,
                        }
                    }
                }
                return styles;
            },
        },
        methods: {
            close() {
                this.$emit('close', this.timestamp);
            },
        },
        mounted() {
            this.elmHeight = this.$el.clientHeight;
            if (this.timeout) {
                setTimeout(this.close, this.timeout);
            }
        },
    };
</script>
<style lang="scss">
.alert {
    @apply mb-4 text-xs font-normal text-gray-900 bg-white leading-tight;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-left-width: 15px;
    
    z-index: 10000;
    width: 300px;
    
    &.center {
        margin: 0 auto;
    }
    
    &.left {
        left: 10px;
    }
    
    &.right {
        right: 10px;
    }
}

@screen sm {
    .alert {
        width: 460px;
        border-left-width: 5px;
    }
    
    &.left {
        left: 20px;
    }
    
    &.right {
        right: 20px;
    }
}
</style>
