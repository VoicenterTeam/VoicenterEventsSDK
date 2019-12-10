<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.time.frame')" name="timeFrame">
            <slot name="frame-types"/>
            <div>
                <label>{{$t('widget.time.interval')}}</label>
                <component :is="getComponent" v-bind="$attrs"/>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import {Collapse, CollapseItem} from 'element-ui'
    import TimeAbsolute from './TimeAbsolute'
    import TimeRelative from './TimeRelative'
    import {capitalizeFirstLetter} from '@/helpers/util'

    export default {
        components: {
            TimeAbsolute,
            TimeRelative,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
        },
        props: {
            timeFrameType: {
                type: String,
                default: 'relative'
            }
        },
        data() {
            return {
                activeCollapse: 'timeFrame',
            }
        },
        computed: {
            getComponent() {
                return 'Time' + capitalizeFirstLetter(this.timeFrameType)
            }
        }
    }
</script>
