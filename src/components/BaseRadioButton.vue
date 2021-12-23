<template>
  <div
    class="vc-form-radio"
    :class="[ disabled, otherClasses ]"
    @keydown.space.prevent
  >
    <label
      :for="labelId"
      class="vc-form-radio-label"
      @keyup.stop.prevent="changeChecked"   
      @click.prevent="changeModel"
    >
      <input
        :id="labelId"
        v-model="model"
        :value="value"
        :disabled="disabled"
        :data-test="`radio-${dataTestName}`"
        :name="groupName"
        class="vc-form-radio-input"
        type="radio"
      >
      <span
        class="vc-form-icon-sign"
        :class="{ 'vc-icon-checkmark-solid text-white': model === value }"
      />
      <span
        v-if="$slots.default || label"
        class="vc-form-radio-label-text"
      >
        <slot>
          <div
            class="vc-radio-label"
            :class="radioLabelClass || RADIO_DEFAULT_LABEL_CLASS"
          >
            <div class="text-overflow">
              {{ label }}
            </div>
          </div>
        </slot>
      </span>
    </label>
  </div>
</template>

<script>
const RADIO_DEFAULT_LABEL_CLASS = 'vc-radio-default-label'

export default {
  name: 'VcRadio',
  model: {
    prop: 'modelValue'
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
      description: 'Radio value'
    },
    value: {
      type: String,
      default: '',
      description: 'Static Radio value'
    },
    groupName: {
      type: String,
      default: '',
      description: 'Radio group name'
    },
    disabled: {
      type: Boolean,
      default: false,
      description: 'Whether VcRadio is disabled'
    },
    checked: {
      type: Boolean,
      default: false,
      description: 'Is Radio checked'
    },
    label: {
      type: String,
      default: '',
      description: 'Radio label'
    },
    iconType: {
      type: String,
      default: 'radio',
      description: 'Radio icon type: radio | checkbox'
    },
    borderless: {
      type: Boolean,
      default: false,
      description: 'Icon border state'
    },
    radioLabelClass: {
      type: String,
      default: '',
      description: 'Radio label classes'
    },
    handUpdate: {
      type: Boolean,
      default: false
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
      labelId: '',
      model: '',
      RADIO_DEFAULT_LABEL_CLASS
    }
  },
  computed: {
    otherClasses () {
      const result = []
      switch (this.iconType) {
        default:
        case 'radio':
          result.push('view-radio')
          break
        case 'checkbox':
          result.push('view-checkbox')
          break
      }
      if (this.borderless) {
        result.push('borderless')
      }
      return result.join(' ')
    }
  },
  watch: {
    modelValue: {
      handler (newV, oldV) {
        if (newV !== oldV || !oldV) {
          this.model = newV
        }
      },
      immediate: true
    },
    model (newV) {
      if (this.handUpdate || newV !== this.value) {
        return
      }
      this.update(newV)
    }
  },
  created () {
    this.labelId = Math.random()
      .toString(16)
      .slice(2)
    if (this.checked) {
      this.update(this.value)
    }
  },
  methods: {
    changeModel () {
      if (this.disabled) {
        return
      }
      this.model = this.value
      if (this.handUpdate) {
        this.update(this.model)
      }
    },
    changeChecked (e) {
      if (e.key === '32' || e.keyCode === 32) {
        this.changeModel()
      }
    },
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
$radio-height: 18px;

.vc-form-radio {
  &.disabled .form-check-label {
    @apply text-primary cursor-not-allowed opacity-50;
  }

  .vc-form-radio-label {
    @apply text-sm text-gray-950 font-normal cursor-pointer inline-flex relative;
    line-height: $radio-height;
  }

  .vc-form-radio-input {
    @apply absolute;
  }

  .vc-radio-label {
    @apply inline-flex;

    &.vc-radio-default-label {
      @apply text-left font-normal;
    }
  }

  .vc-form-icon-sign {
    @apply relative inline-flex;
    width: $radio-height;
    min-width: $radio-height;
    height: $radio-height;

    & + .vc-form-radio-label-text {
      @apply pl-2;
    }
  }

  &.view-radio {
    .vc-form-icon-sign::before,
    .vc-form-icon-sign::after {
      @apply rounded-full inline-block absolute left-0 top-0 transition-all duration-300 ease-in;
      content: '';
    }

    .vc-form-icon-sign::before {
      @apply border-2 border-gray-550;
      width: $radio-height;
      height: $radio-height;
    }

    input[type="radio"] ~ .vc-form-icon-sign:after,
    input[type="radio"] {
      @apply opacity-0;
    }

    input[type="radio"] ~ .vc-form-icon-sign::after {
      @apply bg-primary h-2.5 w-2.5 top-1 left-1;
    }

    input[type="radio"]:checked ~ .vc-form-icon-sign::before {
      @apply border-2 border-primary;
    }

    input[type="radio"]:checked:hover ~ .vc-form-icon-sign::before {
      @apply border-primary;
    }

    input[type="radio"]:checked:hover:focus ~ .vc-form-icon-sign::before {
      @apply border-primary;
    }

    input[type="radio"]:checked ~ .vc-form-icon-sign::after {
      @apply opacity-100;
    }

    input[type="radio"]:checked:hover ~ .vc-form-icon-sign::after {
      @apply bg-primary;
    }

    input[type="radio"]:checked:hover:focus ~ .vc-form-icon-sign::after {
      @apply bg-primary;
    }

    input[type="radio"]:not([disabled]):hover ~ .vc-form-icon-sign:before {
      @apply border-2 border-primary;
    }

    input[type="radio"]:not([disabled]):hover:focus ~ .vc-form-icon-sign:before {
      @apply border-2 border-primary bg-primary;
    }

    &.borderless {
      .vc-form-icon-sign::before,
      input[type="radio"]:checked ~ .vc-form-icon-sign::before,
      input[type="radio"]:checked:hover ~ .vc-form-icon-sign::before,
      input[type="radio"]:checked:hover:focus ~ .vc-form-icon-sign::before,
      input[type="radio"]:not([disabled]):hover ~ .vc-form-icon-sign:before,
      input[type="radio"]:not([disabled]):hover:focus ~ .vc-form-icon-sign:before {
        box-shadow: none;
        border-color: transparent;
      }
    }
  }

  &.view-checkbox {
    .vc-form-icon-sign {
      width: 18px;
      height: 18px;
      @apply border-2 rounded-sm border-primary inline-block relative transition-all duration-300 ease-in;
    }

    .vc-form-icon-sign::before {
      transform: translateX(-50%) translateY(-50%);
      @apply absolute left-2/4 top-2/4 origin-center text-white;
    }

    input[type="radio"]:not(:checked):not(.indeterminate) {
      ~ .vc-form-icon-sign::before {
        content: '';
      }
    }

    input[type="radio"]:checked,
    input[type="radio"].indeterminate {
      + .vc-form-icon-sign {
        @apply border-none bg-primary;
      }

      &:hover {
        + .vc-form-icon-sign {
          @apply bg-primary;
        }

        &:focus {
          + .vc-form-icon-sign {
            @apply bg-primary;
          }
        }
      }

      + .vc-form-icon-sign {
        @apply opacity-100 mt-0;
      }
    }

    input[type="radio"]:not([disabled]):hover + .vc-form-icon-sign {
      @apply border-2 bg-primary;
    }

    input[type="radio"]:not([disabled]):hover:focus + .vc-form-icon-sign {
      @apply border-2 bg-primary;
    }

    &.borderless {
      .vc-form-icon-sign,
      input[type="radio"]:not([disabled]):hover + .vc-form-icon-sign,
      input[type="radio"]:not([disabled]):hover:focus + .vc-form-icon-sign {
        box-shadow: none;
        border-color: transparent;
      }
      .vc-form-icon-sign::before {
        @apply text-primary;
      }
      input[type="radio"]:checked,
      input[type="radio"].indeterminate {
        + .vc-form-icon-sign {
          @apply bg-transparent;
        }

        &:hover {
          + .vc-form-icon-sign {
            @apply bg-transparent;

            &::before {
              @apply text-primary;
            }
          }

          &:focus {
            + .vc-form-icon-sign {
              @apply bg-transparent;

              &::before {
                @apply text-primary;
              }
            }
          }
        }
      }
    }
  }

  input[type="radio"] {
    @apply pointer-events-none opacity-0;
  }
}

[dir="rtl"] {
  .vc-form-radio {
    .vc-form-icon-sign {
      & + .vc-form-radio-label-text {
        @apply pl-0 pr-2;
      }
    }
  }
}
</style>
