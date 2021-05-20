<template>
    <div>
        <div class="cursor-pointer text-primary-300 hover:text-primary"
             @click="showDialog = true">
            <div class="flex items-center">
                <i class="w-4 h-4 mx-2">
                    <IconAddReport/>
                </i>
                <span class="text-main-sm leading-4">
                    {{ $t('Manage Report Items') }}
                </span>
            </div>
        </div>
        <modal :visible.sync="showDialog"
               title="Manage Report Items"
               width="50%"
               :title-centered="true"
               v-show="showDialog">
            <div class="min-h-40">
                <div class="flex w-full justify-center py-4-5">
                    <div class="w-1/2">
                        <el-input :placeholder="$t('Search')"
                                  size="small"
                                  prefix-icon="el-icon-search"
                                  v-model="search"/>
                    </div>
                </div>
                <div v-for="(item, index) in filteredItems"
                     :key="`report-item-${item.WidgetID}`"
                     :index="index"
                >
                    <div class="flex items-center justify-between h-20">
                        <div class="flex items-center">
                            <el-checkbox :value="item.selected"
                                         @change="onTrigger($event, item)"
                            />
                            <component class="mx-3 text-primary"
                                       :is="getTemplateIcon(item)"/>
                            <span class="flex-1 truncate">
                                {{ item.Title }}
                            </span>
                        </div>
                        <div class="flex items-center text-primary">
                            <AlertCircleIcon class="w-5 h-5"/>
                            <span class="mx-2 text-sm">
                                {{ $t('Help') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <template v-slot:footer>
                <div class="border-t-2 border-gray-300 py-4 px-10 flex items-center justify-between">
                    <slot name="footer-actions">
                        <base-button class="mx-4"
                                     @click="showDialog = false"
                                     variant="discard"
                                     fixed-width="w-37">
                            <div class="flex items-center">
                                <IconDiscard class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ 'Cancel' }}</span>
                            </div>
                        </base-button>
                        <base-button fixed-width="w-37"
                                     @click="onSubmit()">
                            <div class="flex items-center">
                                <IconSave class="mx-1"/>
                                <span class="mx-1 text-base font-bold">{{ 'Save' }}</span>
                            </div>
                        </base-button>
                    </slot>
                </div>
            </template>
        </modal>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import { Checkbox } from 'element-ui'
    import Modal from '@/components/Common/Modal'
    import { AlertCircleIcon } from 'vue-feather-icons'
    import { templateIcons } from '@/enum/widgetDataTypes'
    import WidgetGroup from '@/modules/reports/components/report-form/widgets/WidgetGroup'
    
    export default {
        components: {
            Modal,
            WidgetGroup,
            AlertCircleIcon,
            [Checkbox.name]: Checkbox,
        },
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showDialog: false,
                steps: {},
                search: '',
                reportItems: [],
            }
        },
        computed: {
            widgets() {
                return this.$store.getters['dashboards/getAllWidgets']
            },
            filteredItems() {
                return this.reportItems.filter(widget => widget.Title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()))
            },
        },
        methods: {
            getTemplateIcon(item) {
                return templateIcons[item.WidgetLayout.DataTypeID]
            },
            onTrigger(evt, widget) {
                widget.selected = evt
            },
            onSubmit() {
                alert('on submit')
            },
            formatItems(items) {
                this.reportItems = items.map(el => {
                    this.findItem(el, (r) => {
                        if (!r) {
                            return
                        }
                        return {
                            el,
                            selected: r['ReportItemStatusID'] === 1
                        }
                    })
                })
            },
            findItem(item, callback) {
                const result = this.report.ReportItemList.find(el => el.WidgetID.toString() === item.WidgetID.toString())
                return callback(result)
            },
        },
        watch: {
            widgets: {
                immediate: true,
                deep: true,
                handler(data) {
                    //console.log({ data })
                    if (!data) {
                        return
                    }
                    this.formatItems(data)
                },
            },
        },
    }
</script>
