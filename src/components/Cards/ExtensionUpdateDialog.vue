<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h3 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('statusCard.update')}}</h3>

        <div>
            <el-select placeholder="Sort by" v-model="selectedStatus">
                <el-option v-for="option in options" v-bind="option" :key="option.label">
                    <div class="flex">
                        <component class="w-5 mx-1 text-primary" :is="option.icon"></component>
                        <span class="w-16 mx-1">{{option.label}}</span>
                    </div>
                </el-option>
            </el-select>
        </div>

        <template slot="footer">
            <el-button plain @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog, Select, Option} from 'element-ui'

    export default {
        name: 'extension-update-dialog',
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [Select.name]: Select,
            [Option.name]: Option,
        },
        props: {
            extension: {
                type: Object,
                default: ()=> ({})
            },
            status: {
                type: Number
            }
        },
        data() {
            return {
                selectedStatus:'',
                options:[
                    {
                        label: this.$t('extension.status.login'),
                        value: 1,
                        icon: "IconLogin"
                    },
                    {
                        label: this.$t('extension.status.logout'),
                        value: 2,
                        icon: "IconLogout"
                    },
                    {
                        label: this.$t('extension.status.lunch'),
                        value: 3,
                        icon: "IconLunch"
                    },
                    {
                        label: this.$t('extension.status.administrative'),
                        value: 5,
                        icon: "IconAdministrative"
                    },
                    {
                        label: this.$t('extension.status.private'),
                        value: 7,
                        icon: "IconPrivate"
                    },
                    {
                        label: this.$t('extension.status.other'),
                        value: 9,
                        icon: "IconOther"
                    },
                    {
                        label: this.$t('extension.status.training'),
                        value: 11,
                        icon: "IconTraining"
                    },
                    {
                        label: this.$t('extension.status.teamMeeting'),
                        value: 12,
                        icon: "IconTeamMeeting"
                    },
                    {
                        label: this.$t('extension.status.brief'),
                        value: 13,
                        icon: "IconBrief"
                    },
                ]
            }
        },
        mounted() {
            this.selectedStatus = this.status
        },
        methods: {
            onChange() {
                this.$emit('on-change', this.selectedStatus);
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
