<template>
    <el-card class="f-full">
        <div slot="header" class="flex align-middle justify-between">
            <span class="my-auto font-medium">{{triggerName}}</span>
            <div class="flex">
                <i class="vc-icon-schedule-calendar icon-xl text-primary"/>
                <span class="px-2 my-auto">
                    Daily: Mon, Wed, Fri, at 9:00 am
                </span>
                <base-button v-if="showBtnSendNow" type="primary" size="xs" outline @click="onSendNow">
                    <i class="vc-icon-skip-arrow icon-md mx-2"/>
                    {{ $t('report.schedules.sendNow') }}
                </base-button>
            </div>
        </div>
        <div class="flex w-full mb-4">
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
                <div class="w-full" v-if="recipients && recipients.length">
                    <delimited-list :list="recipients" :limit="5" separator=" ">
                        <template v-slot:list-item="{item}">
                            <rec-item
                                type="inactive"
                                :item="item"
                                :name="get(item, 'Email', 'Recipient name')"/>
                        </template>
                        <template v-slot:other-icon="{data}">
                            <tag content-class="icon-ellipsis">+ {{ data }}</tag>
                        </template>
                        <template v-slot:other-content="{list}">
                            <div class="max-w-xs">
                                <div v-for="(item, index) in list" :key="index"
                                     class="flex-1 items-center justify-start p-1">
                                    <tag type="inactive">
                                        {{ get(item, 'Email', 'Recipient name') }}
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
import Mustache from 'mustache'

import RecItem from "@/modules/reports/components/RecItem";
import DelimitedList from "@/modules/reports/components/DelimitedList";
import Tag from "@/modules/reports/components/Tag"
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";


export default {
    name: "schedule-card",
    components: {
        BaseButton,
        [Card.name]: Card,
        ButtonIcon,
        RecItem,
        DelimitedList,
        Tag,
    },
    props: {
        conditions: {
            type: Array
        },
        recipients: {
            type: Array
        },
        triggerName: {
            type: String,
            default: ''
        },
        showBtnSendNow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        onSendNow() {
            console.log('Send now')
        }
    },
    computed: {
        conditionsList() {
            const template = '<span>{{column}} {{operator}} {{value}}</span>'
            const templateAnd = '<span>and {{column}} {{operator}} {{value}}</span>'

            let conditionsToRender = ''
            this.conditions.forEach(el => {
                if(!conditionsToRender) {
                    conditionsToRender += '<div class="flex flex-wrap"> <span>If ('
                } else {
                    conditionsToRender += '<span> or If ('
                }

                for(let i = 1; i <= el.ReportTriggerConditionFilter.length; i++) {
                    const condition = el.ReportTriggerConditionFilter[i - 1]
                    const column = condition.ConditionFilterColumnName
                    const operator = condition.ConditionFilterOperatorSymbol
                    const value = condition.ConditionFilterValue

                    if(i > 1) {
                        conditionsToRender += Mustache.render(templateAnd, {column, operator, value});
                    } else {
                        conditionsToRender += Mustache.render(template, {column, operator, value});
                    }
                }
                conditionsToRender += ')</span>'
            })
            conditionsToRender += '</div>'
            return conditionsToRender
        }
    }
}
</script>
