<template>
    <el-card class="f-full">
        <div slot="header" class="clearfix">
            <span>Card name</span>
            <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
            {{'List item ' + o }}
        </div>
    </el-card>
</template>

<script>
import {Card} from 'element-ui'
import get from 'lodash/get'
import BaseButton from "@/components/Common/Buttons/BaseButton";
import ButtonIcon from "@/modules/common/components/ButtonIcon";


export default {
    name: "schedule-card",
    components: {
        BaseButton,
        [Card.name]: Card,
        ButtonIcon,
    },
    props: {},
    data() {
        return {

        }
    }
}
</script>
