<template>
    <new-base-button
        v-bind="$attrs"
        class="cursor-pointer text-sm text-gray-500 hover:text-primary flex justify-center items-center rounded border border-gray-550 hover:border-primary h-7"
        size="sml"
        custom-size-params="font-semibold"
        v-on="$listeners"
    >
        <template v-slot:icon>
            <IconNewGroup class="mx-0-5"/>
        </template>
        <span class="mx-0-5">{{ $t('Add Group') }}</span>
    </new-base-button>
</template>
<script>
    import NewBaseButton from "@/components/Buttons/NewBaseButton";
    export default {
        inheritAttrs: false,
        components: {
            NewBaseButton
        }
    }
</script>
