<template>
    <div>
        <portal to="form-title">
            {{ $t('widget.allCategories') }}
        </portal>
        <WidgetGroupCard
            v-for="widgetGroup in widgetGroups"
            v-bind="widgetGroup"
            :key="widgetGroup.WidgetGroupID"
            :widget-group="widgetGroup"
            @widget-group-select="selectWidgetGroup"
        />
    </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
import WidgetGroupCard from "@/components/Reports/Widgets/AddWitgetsForm/WidgetGroupCard";

export default {
    components: {
        WidgetGroupCard,
    },
    props: {
        widgetGroups: {
            type: Array,
            default: []
        }
    },
    computed: {
        getWidgetGroups() {
            return cloneDeep(this.$store.state.templatesCategory.all)
        },
    },
    methods: {
        async resetState() {
            // await this.$store.dispatch('widgetCreation/resetState')
            this.$emit('reset-state')
        },
        selectWidgetGroup(group) {
            this.$emit('select-widget-group', group)
        }
    },
    mounted() {
        this.resetState()
    },
}
</script>
