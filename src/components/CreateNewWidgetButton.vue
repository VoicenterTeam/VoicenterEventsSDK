<template>
    <base-button
        v-bind="$attrs"
        size="sml"
        type="primary"
        outline
        custom-size-params="font-semibold"
        v-on="$listeners"
    >
        <template v-slot:icon>
            <IconNewGroup class="mx-0-5"/>
        </template>
        <span class="mx-0-5">{{ $t('dashboard.addNewWidgets') }}</span>
    </base-button>
    
</template>
<script>
    import BaseButton from "@/components/Common/Buttons/BaseButton";

    export default {
        inheritAttrs: false,
        components: {
            BaseButton
        }
    }

</script>
