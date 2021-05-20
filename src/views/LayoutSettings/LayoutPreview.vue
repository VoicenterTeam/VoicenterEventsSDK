<template>
    <div>
        <div class="flex items-center justify-between mb-4"
             v-if="havePreview && headerCaption">
            {{ $t('Preview') }}
            <div class="flex items-center text-primary-300 hover:text-primary cursor-pointer"
                 @click="triggerRealTimePreview">
                <template v-if="realTimePreview">
                    <IconCrossedEye class="mb-0-5 mx-1"/>
                    {{ $t('See without changes') }}
                </template>
                <template v-if="!realTimePreview">
                    <EyeIcon class="w-4 h-4 mb-0-5 mx-1"/>
                    {{ $t('See with changes') }}
                </template>
            </div>
        </div>
        <div class="relative"
             :class="{'full-screen': fullScreenMode}">
            <div class="border border-gray-550 rounded preview-wrapper">
                <div class="content relative"
                     :style="getStyles"
                     :class="{'min-w-screen': havePreview}"
                     id="dashboard-preview">
                    <slot>
                        <Dashboard class="absolute pointer-events-none"
                                   :show-loading-indicator="false"/>
                    </slot>
                </div>
            </div>
            <template v-if="havePreview">
                <div class="absolute right-0 top-0 cursor-pointer z-50 bg-white shadow-base rounded p-2 m-2">
                    <IconExitFullScreenMode class="hover:text-primary"
                                            @click="onFullScreen"/>
                </div>
                <div class="absolute right-0 bottom-0 cursor-pointer z-50 bg-white shadow-base rounded m-2">
                    <IconZoomIn class="hover:text-primary w-4 h-4 m-2"
                                @click="onZoomIn"/>
                    <div class="w-full h-0-25 bg-black -mb-1"/>
                    <IconZoomOut class="hover:text-primary w-4 h-4 m-2"
                                 @click="onZoomOut"/>
                </div>
            </template>
        </div>
        <slot name="actions"/>
    </div>
</template>
<script>
    import Dashboard from '@/views/Dashboard'
    import { EyeIcon } from 'vue-feather-icons'

    export default {
        components: {
            Dashboard,
            EyeIcon,
        },
        props: {
            havePreview: {
                type: Boolean,
                default: true,
            },
            defaultZoom: {
                type: Number,
                default: 1,
            },
            headerCaption: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                realTimePreview: true,
                zoom: this.defaultZoom,
                fullScreenMode: false,
            }
        },
        computed: {
            getStyles() {
                return {
                    zoom: this.zoom,
                }
            },
        },
        methods: {
            triggerRealTimePreview() {
                this.realTimePreview = !this.realTimePreview
                this.$nextTick(() => {
                    this.$emit('on-real-time-preview', this.realTimePreview)
                })
            },
            onZoomIn() {
                if (this.zoom > 1.9) {
                    return
                }
                this.zoom += 0.1
            },
            onZoomOut() {
                if (this.zoom < 0.4) {
                    return
                }
                this.zoom -= 0.1
            },
            onFullScreen() {
                this.fullScreenMode = !this.fullScreenMode
                this.zoom = 1
            },
            handleEscape(e) {
                if (e.code === 'Escape') {
                    this.fullScreenMode = false
                }
            },
            handleDragToScroll() {
                const ele = document.querySelector('.preview-wrapper')
                ele.style.cursor = 'grab';

                let pos = { top: 0, left: 0, x: 0, y: 0 };

                const mouseDownHandler = function (e) {
                    ele.style.cursor = 'grabbing';
                    ele.style.userSelect = 'none';

                    pos = {
                        left: ele.scrollLeft,
                        top: ele.scrollTop,
                        // Get the current mouse position
                        x: e.clientX,
                        y: e.clientY,
                    };

                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                };

                const mouseMoveHandler = function (e) {
                    // How far the mouse has been moved
                    const dx = e.clientX - pos.x;
                    const dy = e.clientY - pos.y;
                    // Scroll the element
                    ele.scrollTop = pos.top - dy;
                    ele.scrollLeft = pos.left - dx;
                };
                const mouseUpHandler = function () {
                    ele.style.cursor = 'grab';
                    ele.style.removeProperty('user-select');

                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };
                // Attach the handler
                ele.addEventListener('mousedown', mouseDownHandler);
            },
        },
        mounted() {
            document.addEventListener('keyup', this.handleEscape)
            this.handleDragToScroll()
        },
        destroyed() {
            document.removeEventListener('keyup', this.handleEscape)
        },
    }
</script>
<style lang="scss">
.preview-wrapper {
    @apply overflow-hidden;
    height: calc(100vh - 300px);

    .content {
        zoom: 0.5;
    }
}

.full-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;

    .preview-wrapper {
        height: 100vh;
        overflow: auto;
    }
}
</style>
