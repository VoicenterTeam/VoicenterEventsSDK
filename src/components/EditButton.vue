<template>
<button class="btn p-2 shadow rounded bg-white hover:bg-green-100"
        :class="{'mx-1': editMode}"
        v-bind="$attrs"
        v-on="$listeners">
    <EditIcon class="w-5 h-5 text-green"/>
</button>
</template>
<script>
import { EditIcon } from 'vue-feather-icons'

export default {
    inheritAttrs: false,
    components: {
        EditIcon,
    },
    props: {
        editMode: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss">
.btn {
    transition: all .2s;
}

.btn:focus {
    outline: none;
    @apply ring;
    @apply bg-blue-200;
}
</style>
