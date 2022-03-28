<template>
    <div>
        <portal to="form-title">
            {{ $t('widget.widgetAdd') }}
        </portal>
        <div class="search">
            <div class="w-full flex justify-center py-4">
                <div class="w-full max-w-md">
                    <el-input
                        v-model="search"
                        :placeholder="$t('general.search')"
                        class="input-search"
                    >
                        <template v-slot:prefix>
                            <i class="el-input__icon vc-icon-search text-primary text-xl" />
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
        <WidgetGroupCard
            v-for="widgetGroup in searchedWidgetGroups"
            v-bind="widgetGroup"
            :key="widgetGroup.WidgetGroupID"
            :widget-group="widgetGroup"
            @widget-group-select="selectWidgetGroup"
        />
    </div>
</template>

<script>
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
    data() {
        return {
            search: ''
        }
    },
    computed: {
        searchedWidgetGroups () {
            if (!this.search) {
                return this.widgetGroups
            }
            return this.widgetGroups.filter(widgetGroup => {
                return widgetGroup.WidgetGroupTitle && widgetGroup.WidgetGroupTitle.toLowerCase().includes(this.search.toLowerCase())
            })
        }
    },
    watch: {
        search() {
            // run search functionality
        }
    },
    methods: {
        selectWidgetGroup(group) {
            this.$emit('select-widget-group', group)
        },
    },
    mounted () {
        this.search = ''
    }
}
</script>
