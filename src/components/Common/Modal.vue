<template>
    <transition
        name="dialog-fade"
        @after-enter="afterEnter"
        @after-leave="afterLeave">
        <div
            v-show="visible"
            class="el-dialog__wrapper"
            :class="wrapperClasses"
            @mousedown.self="handleWrapperClick">
            <div role="dialog"
                 :key="key"
                 aria-modal="true"
                 :aria-label="title || 'dialog'"
                 :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
                 ref="dialog"
                 :style="style">
                <div class="flex items-center modal-header__wrapper overflow-hidden h-16">
                    <slot name="redirect-action"/>
                    <IconVerticalLine v-if="$slots['redirect-action']"
                                      class="h-14"/>
                    <div class="header-title border-gray-300 truncate flex-1 py-3 px-6 overflow-hidden"
                         :class="$rtl.isRTL ? 'border-l-2' : 'border-r-2'">
                        <div class="flex w-full items-center"
                             :class="titleCentered ? 'justify-center' : 'justify-between'">
                            <slot name="title">
                                <span class="el-dialog__title">
                                    {{ $t(title) }}
                                </span>
                            </slot>
                            <slot name="additional-action"/>
                        </div>
                    </div>
                    <button type="button"
                            class="flex text-steel hover:text-primary mx-6"
                            aria-label="Close"
                            v-if="showClose"
                            @click="handleClose">
                        <IconClose class="w-4 h-4"/>
                    </button>
                </div>
                <div class="el-dialog__body"
                     v-bind="$attrs"
                     v-if="rendered">
                    <slot/>
                </div>
                <slot name="footer"/>
            </div>
        </div>
    </transition>
</template>

<script>
    import Popup from 'element-ui/src/utils/popup';
    import 'element-ui/lib/theme-chalk/dialog.css'
    import Migrating from 'element-ui/src/mixins/migrating';
    import emitter from 'element-ui/src/mixins/emitter';
    
    export default {
        name: 'Modal',
        mixins: [Popup, emitter, Migrating],
        props: {
            titleCentered: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
            modal: {
                type: Boolean,
                default: true,
            },
            modalAppendToBody: {
                type: Boolean,
                default: true,
            },
            appendToBody: {
                type: Boolean,
                default: false,
            },
            lockScroll: {
                type: Boolean,
                default: true,
            },
            closeOnClickModal: {
                type: Boolean,
                default: true,
            },
            closeOnPressEscape: {
                type: Boolean,
                default: true,
            },
            showClose: {
                type: Boolean,
                default: true,
            },
            width: {
                type: String,
                default: '60%',
            },
            customClass: {
                type: String,
                default: '',
            },
            top: {
                type: String,
                default: '15vh',
            },
            beforeClose: Function,
            center: {
                type: Boolean,
                default: false,
            },
            destroyOnClose: Boolean,
            wrapperClasses: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                closed: false,
                key: 0,
                fullscreen: false,
            };
        },
        watch: {
            visible(val) {
                if (val) {
                    this.closed = false;
                    this.$emit('open');
                    this.$el.addEventListener('scroll', this.updatePopper);
                    this.$nextTick(() => {
                        this.$refs.dialog.scrollTop = 0;
                    });
                    if (this.appendToBody) {
                        document.body.appendChild(this.$el);
                    }
                } else {
                    this.$el.removeEventListener('scroll', this.updatePopper);
                    if (!this.closed) this.$emit('close');
                    if (this.destroyOnClose) {
                        this.$nextTick(() => {
                            this.key++;
                        });
                    }
                }
            },
            isSmallScreen: {
                immediate: true,
                handler(value) {
                    this.fullscreen = value
                    this.$nextTick(() => {
                        this.key++;
                    })
                },
            },
        },
        computed: {
            style() {
                let style = {};
                if (!this.fullscreen) {
                    style.marginTop = this.top;
                    if (this.width) {
                        style.width = this.width;
                    }
                }
                style.borderRadius = '0.375rem'
                return style;
            },
            isSmallScreen() {
                return this.$store.getters['utils/isSmallScreen']
            },
            pageWidth() {
                return this.$store.getters['utils/pageWidth']
            },
        },
        methods: {
            getMigratingConfig() {
                return {
                    props: {
                        'size': 'size is removed.',
                    },
                };
            },
            handleWrapperClick() {
                if (!this.closeOnClickModal) return;
                this.handleClose();
            },
            handleClose() {
                if (typeof this.beforeClose === 'function') {
                    this.beforeClose(this.hide);
                } else {
                    this.hide();
                }
            },
            hide(cancel) {
                if (cancel !== false) {
                    this.$emit('update:visible', false);
                    this.$emit('close');
                    this.closed = true;
                }
            },
            updatePopper() {
                this.broadcast('ElSelectDropdown', 'updatePopper');
                this.broadcast('ElDropdownMenu', 'updatePopper');
            },
            afterEnter() {
                this.$emit('opened');
            },
            afterLeave() {
                this.$emit('close');
            },
        },
        mounted() {
            if (this.visible) {
                this.rendered = true;
                this.open();
                if (this.appendToBody) {
                    document.body.appendChild(this.$el);
                }
            }
        },
        destroyed() {
            // if appendToBody is true, remove DOM node after destroy
            if (this.appendToBody && this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }
        },
    }
</script>
<style lang="scss">
.modal-header__wrapper {
    @apply border-b-2 border-gray-300;
}

.dialog-fade-enter-active {
    animation: dialog-fade-in 0.3s
}

.dialog-fade-leave-active {
    animation: dialog-fade-out 0.3s
}
</style>
