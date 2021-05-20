<template>
    <div class="flex items-center border-b border-b-2 border-primary py-1 justify-between">
        <input class="appearance-none bg-transparent border-none w-full text-primary font-bold mr-3 py-1 px-2 leading-tight focus:outline-none"
               :placeholder="$t('common.setGroupTitle')"
               :value="value"
               v-bind="$attrs"
               v-on="listeners"
               @keydown.enter="$emit('on-enter')"
               type="text"
               aria-label="Full name">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "base-outline-input",
        props:{
            value: {
                type: [String, Number],
                description: 'Input value'
            }
        },
        model: {
            prop: 'value',
            event: 'input'
        },
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

<style scoped>

</style>
