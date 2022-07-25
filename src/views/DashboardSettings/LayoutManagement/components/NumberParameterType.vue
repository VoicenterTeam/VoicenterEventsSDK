<template>
<div class="py-2 border-b slider">
    <div class="mb-2">
        <label>{{ makePrefixForTranslation(LayoutParameterName) }}</label>
    </div>
    <el-input-number
        v-on="listeners"
        :max="numberConfig.max"
        :min="numberConfig.min"
        :step="numberConfig.step"
        size="mini"
        placeholder="0"
        class="input-number"
        :value="valueToInt"
    />
</div>
</template>
<script>
import { InputNumber } from 'element-ui'
import { optionConfigs } from '../layout-management'

export default {
    inheritAttrs: false,
    name: 'Number',
    components: {
        [InputNumber.name]: InputNumber
    },
    props: {
        LayoutParameterName: {
            type: String,
            Default: '',
        },
        showInput: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            optionConfigs,
        }
    },
    computed: {
        listeners() {
            return {
                ...this.$listeners,
                input: this.onInput,
            };
        },
        valueToInt() {
            return Number(this.$attrs.Value)
        },
        numberConfig() {
            return this.optionConfigs[this.LayoutParameterName]
        }
    },
    methods: {
        onInput(value) {
            const valToEmit = value.toString()
            this.$emit('input', valToEmit);
        },
        makePrefixForTranslation (string) {
            const makeFirstLetterInLowerCase = (string) => string.charAt(0).toLowerCase() + string.slice(1)
            return this.$t(`layout.config.${makeFirstLetterInLowerCase(string)}`)
        }
    }
}
</script>
