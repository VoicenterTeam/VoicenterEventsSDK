<template>
  <div
    class="vc-radio-group-wrapper"
    v-bind="$attrs"
  >
    <BaseRadioButton
      v-for="(item, i) in radios"
      :key="i"
      v-model="model"
      :value="getValue(item)"
      :label="getLabel(item)"
      :group-name="radioGroupName"
      :radio-label-class="radioLabelClass"
      :data-test="`radio-group-${dataTestName}`"
    />
  </div>
</template>

<script>
import BaseRadioButton from './BaseRadioButton.vue'

export default {
  name: 'BaseRadioGroup',
  components: {
    BaseRadioButton
  },
  model: {
    prop: 'value'
  },
  props: {
    value: {
      type: String,
      default: '',
      description: 'Radio value'
    },
    keys: {
      type: Object,
      default: () => {
        return {}
      },
      description: 'Keys for radios props'
    },
    radios: {
      type: Array,
      default: () => [],
      description: 'Radio data'
    },
    groupName: {
      type: String,
      default: '',
      description: 'Radio Group name'
    },
    radioClass: {
      type: String,
      default: '',
      description: 'Radio class'
    },
    radioLabelClass: {
      type: String,
      default: '',
      description: 'Radio label class'
    },
    dataTestName: {
      type: String,
      default: 'default'
    },
    onInput: {
      type: Function,
      default: null,
      description: 'Temporary @input method'
    }
  },
  data () {
    return {
      model: '',
      defaultKeys: {
        label: 'label',
        value: 'value'
      }
    }
  },
  computed: {
    radioGroupName () {
      let name = Math.random()
        .toString(16)
        .slice(2)
      if (this.groupName) {
        name = this.groupName
      }
      return name
    },
    dataKeys () {
      return {
        ...this.defaultKeys,
        ...this.keys
      }
    },
    labelKey () {
      return this.dataKeys.label
    },
    valueKey () {
      return this.dataKeys.value
    }
  },
  watch: {
    value: {
      handler (newV) {
        this.model = newV
      },
      immediate: true
    },
    model (newV, oldV) {
      if (newV === this.value || newV === oldV || !newV) {
        return
      }
      this.update(newV)
    }
  },
  methods: {
    getValue (data) {
      const key = this.valueKey
      return Object.prototype.toString.call(data) === '[object Object]' && key ? data[key] : data
    },
    getLabel (data) {
      const key = this.labelKey
      return Object.prototype.toString.call(data) === '[object Object]' && key ? data[key] : data
    },
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.vc-radio-group-wrapper {
  @apply w-full;
}
</style>
