<template>
    <el-card class="f-full">
        <div slot="header" class="flex align-middle justify-between">
            <!--            <div class="inline-block text-center">-->
            Schedule for Sales Team
            <!--            </div>-->
            <div class="flex align-middle justify-center">
                <div class="inline-block">
                    <i class="vc-icon-schedule-calendar icon-xl text-primary"/>
                    <span>Daily: Mon, Wed, Fri, at 9:00 am</span>
                </div>
                <base-button type="primary" size="xs" outline @click="onSendNow">
                    <i class="vc-icon-skip-arrow icon-md mx-2"/>
                    Send Now
                </base-button>
            </div>
            <!--            <el-button style="float: right; padding: 3px 0" type="text">

                        </el-button>-->
        </div>
        <!--        <div v-for="o in 4" :key="o" class="text item">
                    {{'List item ' + o }}
                </div>-->
        <div>
            <div>Conditions:</div>
            <div>

            </div>
        </div>
        <div class="flex w-full">
            <div class="inline-flex">
                <i class="vc-icon-filter icon-lg mr-2"/>
                <span>Recipient List:</span>
            </div>
            <div class="aa">
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
import get from 'lodash/get'

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
        }
    },
    data() {
        return {}
    },
    methods: {
        onSendNow() {
            console.log('Send now')
        }
    }
}
</script>

<style scoped lang="scss">
.aa {
    flex-grow : 1;
}
</style>
