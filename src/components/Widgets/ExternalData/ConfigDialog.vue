<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <el-form @submit.native.prevent="onChange" :rules="rules" ref="updateWidget" :model="model">
            <el-form-item>
                <label>{{$t('widget.title')}}</label>
                <el-input v-model="model.Title"/>
            </el-form-item>
            <el-form-item>

            </el-form-item>
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

    export default {
        components: {
            [Dialog.name]: Dialog,
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
<style lang="scss" scoped>

</style>
