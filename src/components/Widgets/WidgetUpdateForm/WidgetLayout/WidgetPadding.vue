<template>
    <div>
        <div>
            <label>{{ $t('widget.widgetPadding') }}</label>
        </div>
        <el-input-number
            v-model="model.WidgetLayout.padding"
            :step="step" 
            type="number"
            size="small"
            :min="0"
            placeholder="0"
        />
    </div>
</template>
<script>
    import { InputNumber } from 'element-ui'
    
    export default {
        components: {
            [InputNumber.name]: InputNumber,
        },
        props: {
            model: {
                type: Object,
                default: () => ({}),
            },
            step: {
                type: Number,
                default: 1,
            },
        },
    }
</script>
