<template>
    <div :key="widgetGroup.WidgetGroupID" class="flex flex-col h-full w-full">
        <div :class="getClass"
             :id="gridId"
             :key="gridId"
             ref="widgetListContainer"
        >
            <div
                :key="widget.WidgetID"
                class="grid-stack-item"
                v-bind="gridStackAttributes(widget)"
                v-for="widget in widgets">
                <WidgetErrorBoundary>
                    <Widget
                        :editable="editable"
                        :key="widget.WidgetID"
                        :widget="widget"
                        @remove-item="removeWidget(widget)"
                        @update-item="(data) => updateWidget(data)"
                        v-on="$listeners">
                    </Widget>
                </WidgetErrorBoundary>
            </div>
        </div>
        <div :key="`empty-card-${widgetGroup.WidgetGroupID}`" class="w-full flex justify-center">
            <widget-empty-card
                :widgetGroup="widgetGroup"
                @add-widget="(value) => addWidgetsToGroup(value)"
                key="-1"
                v-bind="$attrs"
                v-if="editable"
                v-on="$listeners">
            </widget-empty-card>
        </div>
        <div :key="`no-data-${widgetGroup.WidgetGroupID}`"
             class="w-full flex flex-col items-center mt-20"
             v-if="widgets.length === 0">
            <IconNoData class="h-56 w-56" v-if="!editable"/>
            <p class="text-gray-600 max-w-lg text-center">{{$t('dashboards.widgets.noData')}}</p>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import Widget from './Widget'
    import WidgetEmptyCard from './WidgetEmptyCard'
    import WidgetErrorBoundary from '@/components/WidgetErrorBoundary'
    import bus from "@/event-bus/EventBus";

    export default {
        components: {
            Widget,
            WidgetEmptyCard,
            WidgetErrorBoundary,
        },
        data () {
            return {
                grid: null,
            }
        },
        props: {
            widgetGroup: {
                type: Object,
                default: null
            },
            editable: {
                type: Boolean,
                default: false
            },
            widgets: {
                type: Array,
                default: () => []
            },
        },
        computed: {
            getClass () {
                return `grid-stack grid-stack-instance-${this.widgetGroup.WidgetGroupID}`
            },
            enabledRTL () {
                const currentLanguage = this.$store.state.lang.language
                return currentLanguage !== 'en';
            },
            gridId() {
                return `grid-stack-${this.widgetGroup.WidgetGroupID}`
            }
        },
        methods: {
            gridStackAttributes (widget) {
                return {
                    id: get(widget, "WidgetID", "999"),
                    "data-gs-id": get(widget, "WidgetID", "999"),
                    "data-gs-x": get(widget, "WidgetLayout.GridLayout.x", 0),
                    "data-gs-y": get(widget, "WidgetLayout.GridLayout.y", 2),
                    "data-gs-width": get(widget, "WidgetLayout.GridLayout.width", 12),
                    "data-gs-height": get(widget, "WidgetLayout.GridLayout.height", 2)
                };
            },
            onListChange (ev) {
                this.$emit('onListChange', {'event': ev, 'group': this.widgetGroup})
            },
            addWidgetsToGroup (widget) {
                const gridStackContainer = this.$refs.widgetListContainer
                if (!gridStackContainer) {
                    return
                }
                const rowCount = gridStackContainer.getAttribute('data-gs-current-row');

                let GridLayout = {
                    x: 0,
                    y: Number(rowCount),
                    width: 12,
                    height: 2,
                }

                widget['WidgetLayout'] = {
                    ...widget['WidgetLayout'],
                    GridLayout
                }

                let objectToEmit = {
                    widgets: [widget],
                    group: this.widgetGroup
                }

                this.$emit('addWidgetsToGroup', objectToEmit)
            },
            removeWidget (widget) {
                this.grid.removeWidget(`#${widget.WidgetID}`);
                this.$emit('removeWidget', {'widget': widget, 'group': this.widgetGroup})
            },
            updateWidget (val) {
                this.$emit('updateWidget', {'widget': val, 'group': this.widgetGroup})
            },
            findMatchingGrid() {
                const matchingGridIndex = window.grids.findIndex(grid => grid.el.id === this.gridId)

                return {
                    grid: window.grids[matchingGridIndex],
                    index: matchingGridIndex
                }
            },
            nextTick() {
              return new Promise((resolve) => {
                  this.$nextTick(resolve)
              })
            },
            async initWindowGrid () {
                await this.nextTick()
                this.tryDestroyGrid()

                const gridOptions = {
                    acceptWidgets: true,
                }

                this.grid = window.GridStack.init(gridOptions, this.$refs.widgetListContainer);

                if (!this.grid) {
                    return
                }

                this.grid.movable('.grid-stack-item', this.editable);
                this.grid.resizable('.grid-stack-item', this.editable);

                window.grids.push(this.grid)
            },
            tryDestroyGrid() {
                const { grid, index } = this.findMatchingGrid()
                if (!grid) {
                    return
                }
                grid.destroy()
                window.grids.splice(index, 1)
            },
            addWidgetsToGrid (widgets) {
                this.$nextTick(() => {
                    widgets.forEach((widget) => {
                        const isPresent = this.widgets.find(w => w.WidgetID === widget.WidgetID)
                        if (!isPresent) {
                            return
                        }
                        this.grid.makeWidget(`#${widget.WidgetID}`);
                    })
                })
            },
        },
        mounted () {
            this.initWindowGrid()
            bus.$on('added-widgets', (widgets) => {
                this.addWidgetsToGrid(widgets)
            });
        },
        watch: {
            editable: {
                handler (state) {
                    this.grid.movable('.grid-stack-item', state);
                    this.grid.resizable('.grid-stack-item', state);
                }
            },
            enabledRTL: {
                handler (state) {
                    this.grid.rtl = state
                }
            },
        },
        beforeDestroy () {
            this.tryDestroyGrid()
        }
    }
</script>
