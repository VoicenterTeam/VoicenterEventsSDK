<template>
    <div
        :key="widgetGroup.WidgetGroupID"
        class="flex flex-col h-full w-full pb-2"
        :class="{'grid-container': editable}"
    >
        <div
            :class="getClass"
            :id="gridId"
            :key="gridId"
            ref="widgetListContainer"
        >
            <div
                v-loading="widget.onLoading"
                :data-id="widget.WidgetID"
                @mousedown="onMousedown"
                class="grid-stack-item overflow-hidden"
                :id="widget.WidgetID"
                v-bind="gridStackAttributes(widget)"
                v-for="widget in widgets"
                :key="widget.WidgetID"
            >
                <WidgetErrorBoundary>
                    <Widget
                        :editable="editable"
                        :inViewById="inViewById"
                        :key="widget.WidgetID"
                        :widget="widget"
                        @remove-item="removeWidget"
                        @update-item="(data) => updateWidget(data)"
                        v-on="$listeners"
                    />
                </WidgetErrorBoundary>
            </div>
        </div>
        <div
            :key="`no-data-${widgetGroup.WidgetGroupID}`"
            class="w-full flex flex-col items-center mt-20"
            v-if="widgets.length === 0"
        >
            <div class="flex flex-col items-center">
                <IconNoData class="h-56 w-56"/>
                <p class="text-gray-600 max-w-lg text-center">
                    {{ $t('dashboard.widgetGroupNoData') }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import bus from '@/event-bus/EventBus'

    export default {
        components: {
            Widget: () => import('./Widget'),
            WidgetErrorBoundary: () => import('@/components/WidgetErrorBoundary'),
        },
        data() {
            return {
                grid: null,
                inViewById: {},
                loading: false,
            }
        },
        props: {
            widgetGroup: {
                type: Object,
                default: null,
            },
            editable: {
                type: Boolean,
                default: false,
            },
            widgets: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            getClass() {
                return `grid-stack grid-stack-instance-${this.widgetGroup.WidgetGroupID}`
            },
            enabledRTL() {
                const currentLanguage = this.$store.state.lang.language
                return currentLanguage !== 'en'
            },
            gridId() {
                return `grid-stack-${this.widgetGroup.WidgetGroupID}`
            },
        },
        methods: {
            gridStackAttributes(widget) {
                return {
                    id: get(widget, 'WidgetID', '999'),
                    'data-gs-id': get(widget, 'WidgetID', '999'),
                    'data-gs-x': get(widget, 'WidgetLayout.GridLayout.x', 0),
                    'data-gs-y': get(widget, 'WidgetLayout.GridLayout.y', 2),
                    'data-gs-width': get(widget, 'WidgetLayout.GridLayout.width', 12),
                    'data-gs-height': get(widget, 'WidgetLayout.GridLayout.height', 2)
                    // 'data-gs-min-width': 2,
                    // 'data-gs-min-height': 4,
                }
            },
            addWidgetsToGroup(widget) {
                const gridStackContainer = this.$refs.widgetListContainer
                if (!gridStackContainer) {
                    return
                }
                const rowCount = gridStackContainer.getAttribute('data-gs-current-row')

                let GridLayout = {
                    x: 0,
                    y: Number(rowCount),
                    width: 12,
                    height: 2,
                }

                widget['WidgetLayout'] = {
                    ...widget['WidgetLayout'],
                    GridLayout,
                }

                let objectToEmit = {
                    widgets: [widget],
                    group: this.widgetGroup,
                }

                this.$emit('add-widgets-to-group', objectToEmit)
            },
            removeWidget(widget) {
                this.grid.removeWidget(`#${widget.WidgetID}`)
                this.$emit('remove-widget', { 'widget': widget, 'group': this.widgetGroup })
            },
            updateWidget(widget) {
                this.$emit('update-widget', { 'widget': widget, 'group': this.widgetGroup })
            },
            findMatchingGrid() {
                const matchingGridIndex = window.grids.findIndex(grid => grid.el.id === this.gridId)

                return {
                    grid: window.grids[matchingGridIndex],
                    index: matchingGridIndex,
                }
            },
            nextTick() {
                return new Promise((resolve) => {
                    this.$nextTick(resolve)
                })
            },
            async initWindowGrid() {
                // await this.nextTick()

                const gridOptions = {
                    acceptWidgets: true,
                }

                this.grid = window.GridStack.init(gridOptions, this.$refs.widgetListContainer)

                if (!this.grid) {
                    return
                }

                this.grid.movable('.grid-stack-item', this.editable)
                this.grid.resizable('.grid-stack-item', this.editable)
                window.grids.push(this.grid)

                this.resizeEventEmitter()
                this.onDragStartEvent()
                this.initIntersectionObserver()
            },
            resizeEventEmitter() {
                this.grid.on('gsresizestop', function (event, element) {
                    const widgetID = element.getAttribute('data-gs-id')
                    bus.$emit('widget-resized', widgetID)
                })
            },
            tryDestroyGrid() {
                const { grid, index } = this.findMatchingGrid()
                if (!grid) {
                    return
                }
                grid.destroy()
                window.grids.splice(index, 1)
            },
            async addWidgetsToGrid(widgets) {
                await this.$nextTick()

                widgets.forEach((widget) => {
                    this.inViewById[widget.WidgetID] = true
                    const isPresent = this.widgets.find(w => w.WidgetID === widget.WidgetID)

                    if (!isPresent) {
                        return
                    }

                    this.grid.makeWidget(`#${widget.WidgetID}`)
                })
            },
            onDragStartEvent() {
                this.grid.on('dragstart', () => {
                    this.onMousedown()
                })
            },
            onMousedown() {
                let preventMovable = !!(this.isWidgetModalOpen() || !this.editable)
                this.grid.movable('.grid-stack-item', !preventMovable)
            },
            isWidgetModalOpen() {
                let bodyElement = document.body
                if (bodyElement.classList.length) {
                    return false
                }
                return bodyElement.classList.contains('el-popup-parent--hidden')
            },
            initIntersectionObserver() {
                const sections = document.querySelectorAll('.grid-stack-item')

                const options = {
                    root: null,
                    threshold: 0.1,
                    rootMargin: '200px',
                }
                let inViewById = {}
                let callback = (entries, observer) => {
                    entries.forEach((entry) => {
                        let id = entry.target.dataset.id
                        if (!entry.isIntersecting) {
                            inViewById[id] = entry.isIntersecting
                        } else {
                            inViewById[id] = entry.isIntersecting
                            observer.unobserve(entry.target)
                        }
                    })
                    this.inViewById = inViewById
                }

                const observer = new IntersectionObserver(callback, options)

                sections.forEach((section) => {
                    observer.observe(section)
                })

                this.observer = observer
            },

        },
        async mounted() {
            await this.initWindowGrid()

            bus.$on('added-widgets', async (widgets) => {
                await this.addWidgetsToGrid(widgets)
            })
        },
        watch: {
            editable: {
                handler(state) {
                    this.grid.movable('.grid-stack-item', state)
                    this.grid.resizable('.grid-stack-item', state)
                },
            },
            enabledRTL: {
                handler(state) {
                    this.grid.rtl = state
                },
            },
        },
        beforeDestroy() {
            this.tryDestroyGrid()
            if (this.observer) {
                this.observer.disconnect()
            }
        },
    }
</script>
<style lang="scss">
.grid-container {
    background-image: radial-gradient(var(--primary-color) 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -9px -5px;
}
</style>
