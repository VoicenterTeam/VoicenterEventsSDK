<template>
    <div class="w-full bg-white px-8 py-4 my-4 flex items-center justify-between rounded-lg shadow">
        <div class="w-full flex flex-row items-center justify-between">
            <slot name="title">
                <h5 class="text-2xl font-bold mx-3">
                    {{data.Title}}
                </h5>
            </slot>
            <slot name="content">
                <h2 class="text-6xl font-bold mx-3 text-green">
                    {{cardValue}}
                </h2>
            </slot>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import UpdateDialog from "./UpdateDialog";

    export default {
        components: {
            UpdateDialog,
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
          return {
              showUpdateDialog: false
          }
        },
        computed: {
            cardValue() {
                let value = get(this.data.WidgetLayout, 'CounterValue') || 0
                return value
            }
        }
    }
</script>
