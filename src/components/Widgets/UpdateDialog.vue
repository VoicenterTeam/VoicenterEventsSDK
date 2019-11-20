<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('widget.update')}}</h3>
        <el-form @submit.native.prevent="onChange">
            <el-form-item :label="$t('widget.update.title')">
                <el-input v-model="title"></el-input>
            </el-form-item>
            <component
                :is="widget.componentType"
                :data="widget"
                :settings="settings">
            </component>
        </el-form>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog} from 'element-ui'
    import cloneDeep from 'lodash/cloneDeep'
    import ExtensionCards from './WidgetUpdateForm/ExtensionCards'

    export default {
        inheritAttrs: false,
        components: {
            ExtensionCards,
            [Dialog.name]: Dialog
        },
        props: {
            widget: {
                type: Object,
                default: () => ({})
            },
            index: Number,
        },
        data() {
            return {
                showForm: false,
                title: '',
                settings: cloneDeep(this.$store.state.dashboards.settings),
            }
        },
        methods: {
            onChange() {
                this.widget.Title = this.title
                this.$emit('on-update', this.widget);

                if (this.widget.componentType === 'ExtensionCards') {
                    this.$emit('onUpdateSettings', this.settings)
                }

                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
        },
        mounted() {
            this.title = this.widget.Title
        },
    }
</script>
<style lang="scss">

</style>
