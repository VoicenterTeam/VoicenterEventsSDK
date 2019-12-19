<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model" v-if="model.WidgetLayout">
            <el-form-item>
                <label>{{$t('widget.title')}}</label>
                <el-input v-model="model.Title"/>
            </el-form-item>
            <el-form-item>
                <label>{{$t('Widget external endpoint')}}</label>
                <el-input v-model="model.WidgetLayout.Endpoint"/>
            </el-form-item>
            <el-form-item>
                <label>{{$t('Widget type')}}</label>
                <el-select v-model="model.WidgetLayout.ComponentTypeID"
                           placeholder="Select"
                           class="w-full pt-2">
                    <el-option
                        v-for="(item, index) of options"
                        :key="index"
                        v-bind="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-alert
                class="mt-12"
                v-html="dictionary[model.WidgetLayout.ComponentTypeID]"
                type="info"
                :closable="false"
                show-icon>
            </el-alert>
<!--                :description="dictionary[model.WidgetLayout.ComponentTypeID]"-->
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import {Dialog, Select, Option, Alert} from 'element-ui'
    import {options, dictionary} from '@/enum/externalDataWidgetConfig'

    export default {
        components: {
            [Dialog.name]: Dialog,
            [Select.name]: Select,
            [Option.name]: Option,
            [Alert.name]: Alert,
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                model: {},
                options,
                dictionary
            }
        },
        computed: {
            rules() {
                return {}
            },
        },
        methods: {
            onChange() {
                this.$emit('on-update', this.model)
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            },
        },
        mounted() {
            this.model = cloneDeep(this.widget)
        }
    }
</script>
