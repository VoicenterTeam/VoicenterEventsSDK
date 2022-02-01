<template>
    <el-select
        v-model="model.WidgetTime.Date_interval"
        placeholder="Select"
        class="w-full pt-2"
        @change="onChange"
    >
        <el-option
            v-for="(item, index) of widgetTimeOptions"
            :key="index"
            :label="$t(item.label)"
            :value="item.Date_interval">
        </el-option>
    </el-select>
</template>
<script>
    import {Option, Select} from 'element-ui'

    export default {
        components: {
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            model: {
                type: Object,
                default: () => ({}),
            },
            widgetTimeOptions: {
                type: Array,
                default: () => [],
            },
        },
        mounted() {
            const dateInterval = this.model.WidgetTime.Date_interval
            const isExistDateIntervalInRange = this.widgetTimeOptions.find(el => el.Date_interval === dateInterval)
            const defaultDateInterval = isExistDateIntervalInRange ? isExistDateIntervalInRange.Date_interval : this.widgetTimeOptions[0].Date_interval
            const defaultDateDeff = isExistDateIntervalInRange ? isExistDateIntervalInRange.datedeff : this.widgetTimeOptions[0].datedeff
            this.$set(this.model.WidgetTime, 'Date_interval', defaultDateInterval)
            this.$set(this.model.WidgetTime, 'datedeff', defaultDateDeff)
        },
        methods: {
            onChange (dateInterval) {
                const widgetTimeOption = this.widgetTimeOptions.find(el => Number(el.Date_interval) === Number(dateInterval))
                if (widgetTimeOption) {
                    this.$set(this.model.WidgetTime, 'Date_interval', widgetTimeOption.Date_interval)
                    this.$set(this.model.WidgetTime, 'datedeff', widgetTimeOption.datedeff) 
                }
            }
        }
    }
</script>
