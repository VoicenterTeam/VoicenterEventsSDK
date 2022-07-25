const CLASS_FOR_COLOR = 'vc-input-color--'
const CLASS_FOR_ICON_COLOR = 'vc-input-icon-color--'
const CLASS_FOR_ICON_SIZE = 'icon-'
const DEFAULT_COLOR = 'active'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    labelIcon: {
      type: String,
      default: ''
    },
    dataTestName: {
      type: String,
      default: 'default'
    },
    error: {
      type: String,
      default: ''
    },
    dynamicErrorSpace: {
      type: Boolean,
      default: false
    },
    prefixIconSize: {
      type: String,
      default: 'sm'
    },
    prefixIconColor: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: DEFAULT_COLOR
    },
    name: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: undefined
    },
    maxWidth: {
      type: String,
      default: '200'
    }
  },
  data () {
    return {
      defaultPrefixIcon: '',
      colorClass: CLASS_FOR_COLOR,
      iconColorClass: CLASS_FOR_ICON_COLOR
    }
  },
  computed: {
    inputClasses () {
      const colorClass = this.color ? (this.colorClass + this.color) : ''

      return [
        colorClass
      ].join(' ')
    },
    setMaxWidth () {
      return `max-width: ${this.maxWidth}`
    },
    prefixIconColorValue () {
      return this.prefixIconColor || this.color
    },
    prefixClasses () {
      const icon = this.prefixIcon || this.defaultPrefixIcon
      const iconSize = CLASS_FOR_ICON_SIZE + this.prefixIconSize
      const result = [
        icon,
        iconSize
      ]
      if (!this.prefixIconColorIsHex) {
        const colorClass = this.prefixIconColorValue ? (this.iconColorClass + this.prefixIconColorValue) : ''
        result.push(colorClass)
      }

      return result
    },
    prefixIconColorIsHex () {
      const regex = new RegExp('^(?=#[a-hA-H0-9]*$)(?:.{7}|.{9})$', 'g')
      return regex.test(this.prefixIconColorValue)
    },
    prefixStyle () {
      const style = {}
      if (this.prefixIconColorIsHex) {
        style.color = this.prefixIconColorValue
      }
      return style
    }
  }
}