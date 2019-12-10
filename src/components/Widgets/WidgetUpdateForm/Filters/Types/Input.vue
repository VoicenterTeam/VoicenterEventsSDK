<template>
    <input
        class="w-full my-2 py-2 px-4 appearance-none border rounded focus:outline-none focus:border-primary"
        v-bind="$attrs"
        v-on="listeners">
    </input>
</template>
<script>
    export default {
        inheritAttrs: false,
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput
                };
            }
        },
        methods: {
            onInput(evt) {
                this.$emit('input', evt.target.value);
            }
        }
    }
</script>
