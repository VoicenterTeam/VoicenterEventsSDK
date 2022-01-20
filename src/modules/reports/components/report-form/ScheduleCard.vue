<template>
    <div class="p-4 bg-white rounded text-gray-950">
        <div class="header md:grid md:grid-cols-3 gap-6 pb-3 border-b">
            <div class="col-span-1 text-xl leading-6 font-medium">
                {{ schedule.name }}
            </div>
            <div class="col-span-1 flex items-center">
                <i class="text-primary -mt-0-5">
                    <IconCalendar/>
                </i>
                <span class="font-medium mx-1">
                    {{ $t(schedule.time.frequency) }}:
                </span>
                <span class="font-normal text-base">
                    {{ getDays }}
                </span>
            </div>
            <div class="col-span-1 actions flex items-center justify-end">
                <el-tooltip :content="$t('Edit Report')"
                            placement="top">
                            <span class="cursor-pointer mx-2 text-green hover:opacity-75">
                                <IconPencil class="w-4-5 h-4-5 mt-1"/>
                            </span>
                </el-tooltip>
                <el-tooltip :content="$t('Delete Report')"
                            placement="top">
                            <span class="cursor-pointer text-red hover:opacity-75">
                                <IconDelete class="w-4 h-4"/>
                            </span>
                </el-tooltip>
            </div>
        </div>
        <div class="conditions pt-3 flex">
            <span class="flex items-center font-medium leading-5">
                <IconCondition class="w-4 h-4 text-primary"/>
                <span :class="!$rtl.isRTL ? 'ml-2 mr-9' : 'ml-9 mr-2'">
                    {{ $t('Conditions') }}:
                </span>
            </span>
            <p class="text-sm leading-5 font-normal">
                {{ getConditions }}
            </p>
        </div>
        <div class="recipients pt-6 flex">
            <span class="flex items-center font-medium leading-5">
                <IconEmailGroup class="w-4 h-4 text-primary"/>
                <span class="mx-2">
                    {{ $t('report.recipientList') }}:
                </span>
            </span>
            <RecipientCard v-for="(recipient, index) in schedule.recipients"
                           :recipient="recipient"
                           :key="`recipient-${index}`"/>
        </div>
    </div>
</template>
<script>
    import RecipientCard from '@/modules/reports/components/report-form/RecipientCard'

    export default {
        components: {
            RecipientCard,
        },
        props: {
            schedule: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            getDays() {
                return this.schedule.time.days.join(', ')
            },
            getConditions() {
                return this.schedule.conditions.join(', ')
            },
        },
        methods: {},
    }
</script>
