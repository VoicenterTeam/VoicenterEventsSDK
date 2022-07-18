<template>
  <div
    :style="setMaxWidth"
    :data-test-name="dataTestName"
    class="vc-time-input"
  >
    <div
      v-if="label || labelIcon"
      class="vc-time-input__label-wrap"
    >
      <label class="vc-time-input__label">
        <span
          v-if="labelIcon"
          class="vc-time-input__label-icon-wrap"
        >
          <i
            :class="labelIcon"
            class="icon-lg vc-time-input__label-icon text-icons"
          />
        </span>
        <span
          v-if="label"
          class="vc-time-input__label-text"
        >
          {{ label }}
          <span
            v-if="required"
            class="vc-time-input__label-required-icon"
          >
            *
          </span>
        </span>
      </label>
    </div>
    <div
      :class="[
        inputClasses,
        {
          'is-focused': isFocus,
          'is-disabled': disabled
        }
      ]"
      data-test="vc-time-input"
      class="vc-time-input__container"
    >
      <div
        class="vc-time-input__btn-decrease"
        data-test="decrease-button"
        :class="{
          'is-disabled': disabledDecreaseBtn
        }"
        @click="decrease"
      >
        <i class="vc-icon-minus-linear icon-base icon" />
      </div>
      <div
        class="vc-time-input__input-wrapper"
        data-test="time-input-container"
      >
        <div
          v-if="hideInputs"
          class="vc-time-input__empty-placeholder"
          @click="onPlaceholderClick"
        >
          {{ placeholderInput }}
        </div>
        <div
          class="vc-time-input__times"
          @wheel="onWheelMouse"
        >
          <input
            ref="hours"
            v-model="time.hours"
            class="vc-time-input__input hours"
            type="number"
            data-test="hours"
            :disabled="disabled"
            :placeholder="'00'"
            @focusin="isFocus = true"
            @focusout="isFocus = false"
            @click="onClickInput('hours')"
          >
          <div class="divider-wrapper">
            <span class="divider">{{ divider }}</span>
          </div>
          <input
            ref="minutes"
            v-model="time.minutes"
            class="vc-time-input__input minutes"
            type="number"
            data-test="minutes"
            :disabled="disabled"
            :placeholder="'00'"
            @focusin="isFocus = true"
            @focusout="isFocus = false"
            @click="onClickInput('minutes')"
          >
          <div class="divider-wrapper">
            <span class="divider">{{ divider }}</span>
          </div>
          <input
            ref="seconds"
            v-model="time.seconds"
            class="vc-time-input__input seconds"
            type="number"
            data-test="seconds"
            :disabled="disabled"
            :placeholder="'00'"
            @focusin="isFocus = true"
            @focusout="isFocus = false"
            @click="onClickInput('seconds')"
          >
        </div>
      </div>
      <div
        class="vc-time-input__btn-increase"
        data-test="increase-button"
        :class="{
          'is-disabled': disabledIncreaseBtn
        }"
        @click="increase"
      >
        <i class="vc-icon-plus-linear icon-base icon" />
      </div>
    </div>
  </div>
</template>

<script>
const CLASS_FOR_COLOR = 'vc-time-input-color--'
import baseInputMixin from '@/mixins/baseInputMixin'

export default {
  name: 'VcTimeInput',
  mixins: [baseInputMixin],
  props: {
    value: {
        type: Number,
        default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 86400
    },
    dataTestName: {
      type: String,
      default: ''
    },
    divider: {
      type: String,
      default: ':'
    },
    emptyDataText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    allowMouseWheel: {
      type: Boolean,
      default: false
    }
  },
//   emits: ['input', 'update:modelValue'],
  data () {
    return {
      focused: false,
      colorClass: CLASS_FOR_COLOR,
      isFocus: false,
      localTimeValue: 0,
      time: {
        hours: '0',
        minutes: '0',
        seconds: '0'
      }
    }
  },
  computed: {
    useLocalData () {
      return !Number.isInteger(this.value)
    },
    timeModel () {
      if (!this.useLocalData) {
        return this.value
      }
      const { hours, minutes, seconds } = this.time
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
    },
    disabledDecreaseBtn () {
      const _time = this.timeModel
      return _time <= this.minValue || this.disabled
    },
    disabledIncreaseBtn () {
      const _time = this.timeModel
      return (this.maxValue !== 0 && _time >= this.maxValue) || this.disabled
    },
    hideInputs () {
      const _time = this.value || this.timeModel
      return !!(!this.isFocus && _time === 0 && this.emptyDataText)
    },
    placeholderInput () {
      return this.emptyDataText || this.placeholder || '00:00:00'
    }
  },
  watch: {
    'time.seconds': {
      immediate: true,
      handler (val) {
        this.time.seconds = this.updateTimeInput(val, 'seconds')
      }
    },
    'time.minutes': {
      immediate: true,
      handler (val) {
        this.time.minutes = this.updateTimeInput(val, 'seconds')
      }
    },
    'time.hours': {
      immediate: true,
      handler (val) {
        this.time.hours = this.updateTimeInput(val, 'hours')
      }
    },
    timeModel: {
      immediate: true,
      handler (val) {
        if (this.maxValue > 0 && val > this.maxValue) {
          this.setTimeData(this.maxValue)
        } else if (val < this.minValue) {
          this.setTimeData(this.minValue)
        } else {
          this.setTimeData(val)
        }
      }
    },
    time: {
      deep: true,
      handler (val) {
        if (!this.useLocalData) {
          const _seconds = this.getSecondsOfTime(val)
          this.$emit('input', _seconds)
        }
      }
    }
  },
  mounted () {
    if (!this.useLocalData && this.timeModel < this.minValue) {
      this.$emit('input', this.minValue)
    }
  },
  methods: {
    onWheelMouse (event) {
      if (this.allowMouseWheel) {
        event.preventDefault()
        if (event.deltaY < 0) {
          this.increase()
        } else if (event.deltaY > 0) {
          this.decrease()
        }
      }
    },
    getSecondsOfTime (time) {
      const { hours, minutes, seconds } = time
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
    },
    onPlaceholderClick () {
      this.onTimeInputSelect('seconds')
    },
    onClickInput (type) {
      this.$refs[type].select()
    },
    onTimeInputSelect (type) {
      this.$refs[type].focus()
    },
    updateTimeInput (val, type) {
      const correctValue = this.checkValue(val, type)
      return this.setFormatValue(correctValue)
    },
    checkValue (val, type) {
      let timeValue = parseInt(val) || 0
      if (timeValue < 0) {
        timeValue = 0
      }
      if (['minutes', 'seconds'].includes(type) && timeValue > 59) {
        timeValue = 59
      }

      return timeValue
    },
    setFormatValue (val) {
      if (val < 10) {
        return `0${val}`
      }
      return `${val}`
    },
    getTimeData (value) {
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor(value / 60 - hours * 60)
      const seconds = Math.floor(value - hours * 3600 - minutes * 60)

      return {
        hours,
        minutes,
        seconds
      }
    },
    decrease () {
      if (this.disabledDecreaseBtn) {
        return
      }
      let _nevTime = this.timeModel - this.step
      if (_nevTime <= 0) {
        _nevTime = 0
      } else if (_nevTime < this.minValue) {
        _nevTime = this.minValue
      }
      this.setTimeData(_nevTime)
    },
    increase () {
      if (this.disabledIncreaseBtn) {
        return
      }
      let _nevTime = this.timeModel + this.step
      if (_nevTime >= this.maxValue) {
        _nevTime = this.maxValue
      }
      this.setTimeData(_nevTime)
    },
    setTimeData (time) {
      const _timeData = this.getTimeData(time)
      this.time.hours = this.setFormatValue(_timeData.hours)
      this.time.minutes = this.setFormatValue(_timeData.minutes)
      this.time.seconds = this.setFormatValue(_timeData.seconds)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc-time-input {
    @apply w-full;
    &__container {
      @apply
      relative
      flex
      items-center justify-between
      h-8
      rounded
      border border-field-borders
      outline-none
      overflow-hidden
      text-sm
      ;
      &:hover:not(.is-disabled) {
        @apply shadow-focus-outer;
      }
      &.vc-time-input-color--active {
        &:hover:not(.is-disabled) {
          @apply shadow-focus-outer;
        }
        &.is-focused:not(.is-disabled):not(.is-error) {
          color: #DCDFE6;
        }
      }
      &.vc-time-input-color--primary {
        &:hover:not(.is-disabled) {
          @apply shadow-focus-outer-primary;
        }
        &.is-focused:not(.is-disabled):not(.is-error) {
          @apply border-primary-actions--focus;
        }
      }
      &.is-disabled {
        @apply bg-default-bg;
        &:hover, input {
          @apply cursor-not-allowed;
        }
      }
    }
    &__btn-decrease, &__btn-increase {
        background-color: #F5F7FA;
      @apply
      flex-shrink-0
      w-8
      h-full
      flex
      items-center
      justify-center
      select-none;
      &:hover {
        @apply cursor-pointer;
      }
      .icon {
        color: #606266;
      }
      &.is-disabled {
        &:hover {
          @apply cursor-not-allowed;
        }
        .icon {
          color: #606266;
          @apply opacity-50;
        }
      }
    }

    &__input-wrapper {
      @apply h-full flex-grow;
    }

    &__empty-placeholder {
      @apply w-full h-full flex items-center justify-center text-placeholders;
      &:hover {
        cursor: text;
      }
    }

    &__times {
      color: #606266;
      @apply h-full flex justify-center items-center;
      .vc-time-input__input {
        @apply h-full w-6 outline-none text-sm appearance-none text-center py-px px-0.5;
        &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
    .divider-wrapper {
      @apply inline-flex items-center h-full;
    }
  }
</style>
