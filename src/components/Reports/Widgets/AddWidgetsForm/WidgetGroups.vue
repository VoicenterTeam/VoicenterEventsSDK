<template>
    <div>
        <portal to="form-title">
            {{ $t('widget.widgetAdd') }}
        </portal>
        <portal to="redirect-action">
          <span class="text-primary redirect-action"
                @click="goToWidgetGroups">
                <IconDirLeft class="mx-2"/>
                {{ $t('general.back') }}
            </span>
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
            :key="widgetGroup.WidgetGroupID"
            :widget-group="widgetGroup"
            @widget-group-select="selectWidgetGroup"
        />
    </div>
</template>

<script>
import WidgetGroupCard from "@/components/Reports/Widgets/AddWidgetsForm/WidgetGroupCard"

export default {
    components: {
        WidgetGroupCard,
    },
    props: {
        widgetGroups: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: '',
            widgetGroupsLocal: []
        }
    },
    computed: {
        searchedWidgetGroups () {
            if (!this.search) {
                return this.widgetGroupsLocal
            }
            return this.widgetGroupsLocal.filter(widgetGroup => {
                const widgetGroupID = String(widgetGroup.WidgetGroupID)
                return (widgetGroup.WidgetGroupTitle && widgetGroup.WidgetGroupTitle.toLowerCase().includes(this.search.toLowerCase()))
                || (widgetGroupID && widgetGroupID.includes(this.search))
            })
        }
    },
    methods: {
        selectWidgetGroup(group) {
            this.$emit('select-widget-group', group)
        },
        async goToWidgetGroups() {
            await this.$emit('go-to-widget-groups')
        }
    },
    async mounted () {
        this.widgetGroupsLocal = this.widgetGroups
        this.search = ''
    }
}
</script>
