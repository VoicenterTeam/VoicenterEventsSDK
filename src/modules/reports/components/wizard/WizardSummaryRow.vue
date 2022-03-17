<template>
    <p>
        <span class="font-medium text-sm lg:text-base" v-html="label"></span>
        <span v-if="isNotObject && !isArray"
              class="text-value font-normal text-sm lg:text-base break-all" v-html="formattedValue"></span>
        <span v-else-if="isArray">
            {{formattedValueAsArray}}
        </span>
        <span v-else-if="Object.keys(objectData).length">
            <span v-for="(item, index) in objectData" :key="index"
                class="ml-5">
                <br/>
                <span class="ml-3" v-html="`${index}: `"></span>
                <span v-html="item"></span>
            </span>
        </span>
    </p>
</template>

<script>
    export default {
        name: 'WizardSummaryRow',
        props: {
            label: [String, Number],
            value: [String, Number, Array, Object, Boolean],
            format: {
                type: String,
                default: '',
                description: '""|"on-off"|"time"'
            }
        },
        computed: {
            objectData() {
              if(!this.isNotObject) {
                return this.getObjectData(this.value)
              }
              return {}
            },
            isNotObject() {
                const value = this.getObjectData(this.value)
                return !(typeof value === 'object' && value !== null && !this.isArray)
            },
            isArray() {
                return Array.isArray(this.value)
            },
            formattedValue() {
                let value = this.value
                switch (this.format) {
                    case "on-off":
                        value = +this.value ? this.$t('general.on') : this.$t('general.off');
                        break;
                    case "time":
                      value = `${this.value} s`;
                      break;
                }

                return value
            },
            formattedValueAsArray() {
                let result = "["
                if(this.value && this.value.length) {
                    result += ' ' + this.value.join(', ')
                }
                result += " ]"
                return result
            }
        },
        methods: {
           getObjectData(value) {
               try {
                  return typeof value === 'string' ?  JSON.parse(value) : value
               } catch (e) {
                  return value
               }
           }
        }
    }
</script>

<style scoped lang="scss">
    .text-value {
        &::before {
            @apply inline pl-1;
            content: "\202A";
        }
    }
</style>
