<template>
    <el-collapse v-model="activeCollapse" class="pt-4">
        <el-collapse-item :title="$t('settings.time.frame')" name="timeFrame">
            <slot name="frame-types"></slot>
            <div>
                <label>{{$t('widget.time.interval')}}</label>
                <component :is="getComponent" v-bind="$attrs"></component>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
    import {Collapse, CollapseItem} from 'element-ui'
    import TimeAbsolute from './TimeAbsolute'
    import TimeRelative from './TimeRelative'

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
                activeCollapse: ['timeFrame'],
            }
        },
        computed: {
            getComponent() {
                return 'Time' + this.capitalizeFirstLetter(this.timeFrameType)
            }
        }
    }
</script>
