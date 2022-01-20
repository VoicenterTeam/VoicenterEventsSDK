<template>
    <div class="mt-8 text-gray-950">
        <Tabs :current="activeSection"
              @on-change="onSelectSection"
              :options="sections">
            <div class="rounded-md p-8 shadow-base bg-white w-full"
                 :class="$rtl.isRTL  ? 'rounded-tr-none' : 'rounded-tl-none'">
                <fade-transition mode="out-in" :duration="150">
                    <component :key="activeSection"
                               v-bind="$attrs"
                               v-on="$listeners"
                               :is="activeSection"/>
                </fade-transition>
            </div>
        </Tabs>
    </div>
</template>
<script>
    import Tabs from '@/modules/common/components/Tabs'
    import Schedules from '@/modules/reports/components/report-form/Schedules'
    import Widgets from '@/modules/reports/components/report-form/widgets/Widgets'
    
    export default {
        components: {
            Tabs,
            Widgets,
            Schedules,
        },
        data() {
            return {
                activeSection: 'Widgets',
                sections: [
                    {
                        label: this.$t('Widgets'),
                        key: 'Widgets',
                        icon: 'IconWidget',
                    },
                    {
                        label: this.$t('report.schedules'),
                        key: 'Schedules',
                        icon: 'IconSettings',
                    },
                ],
            }
        },
        methods: {
            onSelectSection(section) {
                this.activeSection = section
            },
        },
    }
</script>
