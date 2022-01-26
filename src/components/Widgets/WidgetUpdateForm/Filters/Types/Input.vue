<template>
    <input
        class="w-full my-2 py-2 px-4 appearance-none border rounded focus:outline-none focus:border-primary"
        v-bind="attrs"
        v-on="listeners">
    </input>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: ['value', 'type'],
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput
                };
            },
            attrs () {
                return {
                    ...this.$attrs,
                    value: this.value,
                    type: this.type
                }
            }
        },
        methods: {
            onInput(evt) {
                let value = evt.target.value
                if (this.type === 'number') {
                    if (Object.prototype.hasOwnProperty.call(this.$attrs, 'min')) {
                        const min = parseInt(this.$attrs.min)
                        if (value < min || value == null) {
                            value = min
                        }
                    }
                    if (Object.prototype.hasOwnProperty.call(this.$attrs, 'max')) {
                        const max = parseInt(this.$attrs.max)
                        if (value > max) {
                            value = max
                        }
                    }
                }
                this.$emit('input', value);
            }
        }
    }
</script>
