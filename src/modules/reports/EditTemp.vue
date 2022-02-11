<template>
    <div class="w-full bg-gray-200">
        Edit page
        <br>
        <div v-if="report">{{ report }}</div>
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
    name: "edit-temp",
    props: {
        data: {
            type: Object,
            default: null
        },
        reportId: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
        return {
            report: {}
        }
    },
    mounted() {
        if (this.data) {
            console.log('IF', this.data)
            this.report = cloneDeep(this.data)
        } else {
            console.log('ELSE')
            setTimeout(() => {
                this.report = {
                    name: "fetched",
                    contact: "+380954522454",
                    country: "toto",
                    id: '422'
                }
                console.log('this.reportId', this.reportId)
                this.$emit('update-title', this.reportId, 'koko')
            }, 5000)
        }
    }
}
</script>
