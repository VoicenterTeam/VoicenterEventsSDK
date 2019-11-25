<template>
    <input
        class="w-full my-2 py-2 px-4 appearance-none border rounded focus:outline-none focus:border-primary"
        v-bind="$attrs"
        type="text"
        v-on="listeners">
    </input>
</template>
<script>
    export default {
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

                if (!this.touched) {
                    this.touched = true;
                }
                this.$emit('input', evt.target.value);
            }
        }
    }
</script>
