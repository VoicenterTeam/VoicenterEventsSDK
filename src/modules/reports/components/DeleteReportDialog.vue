<template>
    <confirm-dialog v-bind="$attrs" v-on="$listeners">
        <template v-slot:title>
            <h3 class="text-main-2xl font-semibold text-gray-700">
                Delete Report
            </h3>
        </template>
        <div class="flex justify-center w-full">
            <div class="text-center text-gray-900 text-main-sm leading-21 my-6 max-w-65-p">
                Are you sure you want to delete this report?
            </div>
        </div>
<!--        <template v-slot:footer-actions>
            <slot name="footer-actions">
                <base-button class="mx-4"
                             outline
                             fixed-width="w-37"
                             @click="() => {}">
                    <div class="flex items-center">
                        <IconDiscard class="mx-1"/>
                        <span class="mx-1 text-base font-bold">Cancel</span>
                    </div>
                </base-button>
                <base-button @click="() => {}"
                             type="danger"
                             key="delete">
                    Delete
                </base-button>
            </slot>
        </template>-->
    </confirm-dialog>
</template>

<script>
import ConfirmDialog from "@/components/Common/ConfirmDialog";

export default {
    name: "delete-report-dialog",
    components: {
        ConfirmDialog
    },
    props: {},
    methods: { }
}
</script>

<style scoped lang="scss">

</style>
