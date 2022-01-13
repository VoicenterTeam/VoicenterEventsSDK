import get from 'lodash/get'
import { WidgetApi } from '@/api/widgetApi'

export default {
    computed: {
        dataCounts() {
            if (this.filteredDataLength) {
                let from = this.pageSize * (this.currentPage - 1) + 1
                let to = (this.pageSize * this.currentPage) < this.filteredDataLength ? (this.pageSize * this.currentPage) : this.filteredDataLength
                return from + ' - ' + to
            }
            return 0 + ' - ' + 0
        },
        availableColumns() {
            return get(this.widget.WidgetLayout, 'Columns.availableColumns') || this.columns
        },
        visibleColumns() {
            return get(this.widget.WidgetLayout, 'Columns.visibleColumns') || this.columns.map(c => c.prop)
        },
    },
    methods: {
        handlePageChange(val) {
            this.currentPage = val
        },
        async onUpdateLayout(data) {
            this.widget.WidgetLayout['Columns'] = {
                ...this.widget.WidgetLayout['Columns'],
                ...data,
            }
            await WidgetApi.update(this.widget)
            let {WidgetData} = await WidgetApi.find(this.widget.WidgetID)
            this.widget = {
                ...this.widget,
                ...WidgetData,
                WidgetConfig: this.widget.WidgetConfig,
            }
            this.data.WidgetLayout = WidgetData.WidgetLayout || this.widget.WidgetLayout
        },
    },

}
