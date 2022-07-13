<template>
  <div class="py-2 border-b slider">
    <div class="mb-2">
      <label>{{ makePrefixForTranslation(LayoutParameterName) }}</label>
    </div>
    <base-time-input
      v-on="listeners"
      :max-value="numberConfig.max"
      :min-value="numberConfig.min"
      :step="numberConfig.step"
      class="input-number"
      :value="valueToInt"
      max-width="150px"
      color="primary"
    />
  </div>
</template>

<script>
import BaseTimeInput from '@/components/Common/BaseTimeInput'
import { optionConfigs } from '../layout-management'

export default {
  inheritAttrs: false,
  name: 'Interval',
  components: {
    BaseTimeInput
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
