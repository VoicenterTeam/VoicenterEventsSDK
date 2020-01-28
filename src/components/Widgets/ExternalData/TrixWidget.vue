<template>
    <div>
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4">
            <trix
                :data="fetchData"
                :editable="true"
                @on-update="onUpdate"/>
        </div>
    </div>
</template>

<script>
    import Trix from "../../Trix/Trix";

    export default {
        components: {
            Trix
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            fetchData() {
                return this.data.WidgetLayout.trixData || {}
            }
        },
        methods: {
            onUpdate(val) {
                this.data.WidgetLayout = {
                    ...this.data.WidgetLayout,
                    ...{trixData: val}
                }
                this.$emit('on-update', this.data)
            }
        }
    }
</script>
