<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('chart.update')}}</h3>
        <el-form @submit.native.prevent="onChange">
            <el-form-item :label="$t('chart.update.title')">
                <el-input v-model="title"></el-input>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button plain @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog} from 'element-ui'

    export default {
        name: 'chart-update-dialog',
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog
        },
        props: {
            chartTitle: String,
            index: Number,
        },
        data() {
            return {
                showForm: false,
                title: ''
            }
        },
        mounted() {
            this.title = this.chartTitle
        },
        methods: {
            onChange() {
                this.$emit('on-change', this.title);
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value)
            }
        },
    }
</script>
<style lang="scss">

</style>
