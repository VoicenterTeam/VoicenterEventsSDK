<template>
    <el-card class="f-full">
        <div slot="header" class="flex align-middle justify-between">
            <span class="my-auto font-medium mx-2" :class="actionsWithSchedule ? 'w-1/3' : 'w-2/5'">{{ get(data, 'ReportTriggerName', '') }}</span>
            <div class="flex items-center" :class="actionsWithSchedule ? 'w-1/3 justify-start' : 'w-3/5 justify-end'">
                <i class="vc-icon-schedule-calendar icon-xl text-primary ml-2"/>
                <span class="px-2 my-auto">
                    {{ triggerSchedule }}
                </span>
                <base-button v-if="showBtnSendNow" type="primary" size="xs" class="min-w-36 h-7" outline @click="onSendNow">
                    <i class="vc-icon-skip-arrow icon-md mx-2"/>
                    {{ $t('report.schedules.sendNow') }}
                </base-button>
            </div>
            <div v-if="actionsWithSchedule" class="flex w-1/3 items-center justify-end">
                <schedule-form
                    icon="vc-icon-edit-pencil"
                    :reportId="null"
                    :data="getReportData"
                    :dataToEdit="dataToEdit"
                    :title="$t('widget.editSchedule')"
                />
                <i class="vc-icon-recycle-bin text-red-600 cursor-pointer" @click="deleteSchedule" />
            </div>
        </div>
        <div class="flex w-full mb-4" v-if="get(data, 'ReportTriggerCondition', []).length">
            <div class="inline-flex pr-2">
                <i class="vc-icon-filter icon-lg mr-2 text-primary"/>
                <span>{{ $t('widget.conditions') }}:</span>
            </div>
            <div class="flex-grow" v-html="conditionsList"></div>
        </div>
        <div class="flex w-full">
            <div class="inline-flex pr-2">
                <i class="vc-icon-email-groups icon-lg mr-2 text-primary"/>
                <span>{{ $t('report.recipientList') }}:</span>
            </div>
            <div class="flex-grow">
                <div class="w-full" v-if="get(data, 'ReportRecipient', []).length">
                    <delimited-list :list="data.ReportRecipient" :limit="5" separator=" ">
                        <template v-slot:list-item="{item}">
                            <rec-item
                                type="inactive"
                                :item="item"
                                :name="getRecipientName(item)"/>
                        </template>
                        <template v-slot:other-icon="{data}">
                            <tag content-class="icon-ellipsis">+ {{ data }}</tag>
                        </template>
                        <template v-slot:other-content="{list}">
                            <div class="max-w-xs">
                                <div v-for="(item, index) in list" :key="index"
                                     class="flex-1 items-center justify-start p-1">
                                    <tag type="inactive">
                                        {{ getRecipientName(item) }}
                                    </tag>
                                </div>
                            </div>
                        </template>
                    </delimited-list>
                </div>
                <div v-else>
                    - -
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import {Card} from 'element-ui'
import get from 'lodash/get'
import Mustache from 'mustache'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'

import RecItem from "@/modules/reports/components/RecItem";
import DelimitedList from "@/modules/reports/components/DelimitedList";
import Tag from "@/modules/reports/components/Tag"
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";

const weekDays = {
    1: 'general.dayOfWeek.monday',
    2: 'general.dayOfWeek.tuesday',
    3: 'general.dayOfWeek.wednesday',
    4: 'general.dayOfWeek.thursday',
    5: 'general.dayOfWeek.friday',
    6: 'general.dayOfWeek.saturday',
    7: 'general.dayOfWeek.sunday'
}

const HEBREW_LANG_ID = 285

export default {
    name: "schedule-card",
    components: {
        BaseButton,
        [Card.name]: Card,
        ButtonIcon,
        RecItem,
        DelimitedList,
        Tag,
        ScheduleForm: () => import('@/modules/reports/components/schedule/ScheduleForm.vue')
    },
    props: {
        data: {
            type: Object
        },
        showBtnSendNow: {
            type: Boolean,
            default: false
        },
        actionsWithSchedule: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: null
        }
    },
    data() {
        return {}
    },
    methods: {
        get,
        onSendNow() {
            console.log('Send now')
        },
        getRecipientName(item) {
            if (item.ReportRecipientTypeID === 1) {
                const userItem = this.userEntitiesList.find((user) => {
                    return user.ID === item.RecipientID
                })
                return userItem ? userItem.name : undefined
            } else if (item.ReportRecipientTypeID === 2) {
                const accountItem = this.accountEntitiesList.find((account) => {
                    return account.ID === item.RecipientID
                })
                return accountItem ? accountItem.name : undefined
            } else if (item.ReportRecipientTypeID === 3) {
                return item.Email
            }
        },
        deleteSchedule () {
            this.$store.dispatch('report/deleteReportTriggerItem', this.index)
        }
    },
    computed: {
        accountEntitiesList() {
            return this.$store.getters['entities/accountsList']
        },
        userEntitiesList() {
            return this.$store.getters['entities/usersList']
        },
        triggerSchedule() {
            const reportTriggerTypeID = get(this.data, 'ReportTriggerTypeID')
            const reportTriggerTypeName = get(this.data, 'ReportTriggerTypeName')
            const scheduleData = get(this.data, 'ScheduleData')
            const isHebrew = this.$store.getters['lang/getActiveLanguageID'] === HEBREW_LANG_ID

            const translations = {
                'Interval': 'widget.interval',
                'Daily': 'widget.daily',
                'Monthly': 'widget.monthly'
            }

            let triggerScheduleData = `${this.$t(translations[reportTriggerTypeName])} : `
            if (reportTriggerTypeID === 1) {
                // Interval
                let scheduleDays = []
                const triggerDayOfWeek = get(scheduleData, 'TriggerDayOfWeek', [])
                const triggerInterval = get(scheduleData, 'TriggerInterval')
                const triggerTimeRange = get(scheduleData, 'TriggerTimeRange', {})

                triggerDayOfWeek.forEach(day => {
                    scheduleDays.push(this.$t(weekDays[day]))
                })
                const intervalScheduleDays = scheduleDays.join(', ')

                const intervalScheduleTimeRange = `${this.$t('report.schedules.start')} ${triggerTimeRange.Start}, ` +
                    `${this.$t('report.schedules.end')} ${triggerTimeRange.End}`

                const duration = moment.duration(triggerInterval, 'milliseconds');
                const hours = Math.floor(duration.asHours())
                const minutes = Math.floor(duration.asMinutes()) - hours * 60
                const seconds = Math.floor(duration.asSeconds()) - Math.floor(duration.asMinutes()) * 60

                const intervalScheduleTime = `${this.$t('report.schedules.every')} ${hours}h:${minutes}m:${seconds}s`
                triggerScheduleData += [intervalScheduleDays, intervalScheduleTimeRange, intervalScheduleTime].join(', ')
            } else if (reportTriggerTypeID === 2) {
                // Daily
                const triggerDays = get(scheduleData, 'TriggerDays', [])
                const triggerTime = get(scheduleData, 'TriggerTime')

                let scheduleDays = []
                triggerDays.forEach(day => {
                    scheduleDays.push(this.$t(weekDays[day]))
                })

                const dailyTriggerDays = scheduleDays.join(', ')
                const dailyTriggerTime = `${this.$t('report.schedules.time')} ${triggerTime}`

                triggerScheduleData += [dailyTriggerDays, dailyTriggerTime].join(', ')
            } else if (reportTriggerTypeID === 3) {
                // Monthly
                const triggerDayOfMonth = get(scheduleData, 'TriggerDayOfMonth', []).join(', ')
                const triggerTime = get(scheduleData, 'TriggerTime')

                const monthlyDaysOfMonth = `${this.$t('report.schedules.daysOfTheMonth')} ${triggerDayOfMonth}`
                const monthlyTriggerTime = `${this.$t('report.schedules.at')} ${triggerTime}`

                triggerScheduleData += [monthlyDaysOfMonth, monthlyTriggerTime].join(' ')
            }
            if (isHebrew) {
                triggerScheduleData = triggerScheduleData.split(" ").reverse().join(" ")
            }
            return triggerScheduleData
        },
        conditionsList() {
            const template = '<span>{{column}} {{operator}} {{value}}</span>'
            const templateAnd = '<span>and {{column}} {{operator}} {{value}}</span>'

            let conditionsToRender = ''
            const conditions = get(this.data, 'ReportTriggerCondition', [])
            conditions.forEach(el => {
                if (!conditionsToRender) {
                    conditionsToRender += `<div class="flex flex-wrap"> <span>${this.$t('report.condition.operator.if')} (`
                } else {
                    conditionsToRender += `<span> ${this.$t('report.condition.operator.orIf')} (`
                }

                if (el.ReportTriggerConditionFilter && el.ReportTriggerConditionFilter.length) {
                    for(let i = 1; i <= el.ReportTriggerConditionFilter.length; i++) {
                        const condition = el.ReportTriggerConditionFilter[i - 1]
                        const column = condition.ConditionFilterColumnName
                        const operator = condition.ConditionFilterOperatorSymbol
                        const value = condition.ConditionFilterValue

                        if (i > 1) {
                            conditionsToRender += Mustache.render(templateAnd, {column, operator, value});
                        } else {
                            conditionsToRender += Mustache.render(template, {column, operator, value});
                        }
                    }
                }
                conditionsToRender += ')</span>'
            })
            conditionsToRender += '</div>'
            return conditionsToRender
        },
        getReportData () {
            return this.$store.getters['report/getReportData']
        },
        dataToEdit () {
            const reportTriggerData = cloneDeep(this.getReportData.ReportTriggerList[this.index])
            if ('TriggerTimeRange' in reportTriggerData.ScheduleData) {
                reportTriggerData.ScheduleData.TriggerTimeRange = Object.values(reportTriggerData.ScheduleData.TriggerTimeRange)
            }
            return {
                reportTriggerData: reportTriggerData,
                indexToEdit: this.index
            }
        }
    }
}
</script>
