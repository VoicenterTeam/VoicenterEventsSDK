<template>
    <el-dialog v-bind="$attrs" v-on="$listeners">
        <h5 slot="title" class="text-2xl font-semibold text-gray-700">{{$t('statusCard.update')}}</h5>
        <div class="flex items-center my-4">
            <component class="w-8 mx-1" :is="selectedIcon"></component>
            <p slot="title" class="text-lg font-semibold text-gray-700">{{this.selectedOption.label}}</p>
        </div>
        <div class="w-full flex flex-col">
            <el-select :placeholder="$t('common.selectStatus')"
                       label="select"
                       v-model="selectedStatus"
                       @change="onStatusChange"
                       class="w-full">
                <el-option v-for="option in options"
                           v-bind="option"
                           :key="option.label">
                    <div class="flex">
                        <component class="w-5 mx-1 text-primary" :is="option.icon"></component>
                        <span class="w-16 mx-1">{{option.label}}</span>
                    </div>
                </el-option>
            </el-select>
            <el-checkbox v-model="showStatusText" class="pt-4">
                {{$t('status.show.text')}}
            </el-checkbox>
        </div>
        <template slot="footer">
            <el-button @click="toggleVisibility(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" @click="onChange">{{$t('common.save')}}</el-button>
        </template>
    </el-dialog>
</template>
<script>
    import {Dialog, Select, Option, Checkbox} from 'element-ui'

    export default {
        name: 'extension-update-dialog',
        inheritAttrs: false,
        components: {
            [Dialog.name]: Dialog,
            [Select.name]: Select,
            [Option.name]: Option,
            [Checkbox.name]: Checkbox,
        },
        props: {
            extension: {
                type: Object,
                default: () => ({})
            },
            status: {
                type: Number
            },
            showText: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selectedStatus: '',
                selectedIcon: '',
                selectedOption: {},
                showStatusText: this.showText,
                options: [
                    {
                        label: this.$t('status.login'),
                        value: 1,
                        icon: "IconLogin"
                    },
                    {
                        label: this.$t('status.logout'),
                        value: 2,
                        icon: "IconLogout"
                    },
                    {
                        label: this.$t('status.lunch'),
                        value: 3,
                        icon: "IconLunch"
                    },
                    {
                        label: this.$t('status.administrative'),
                        value: 5,
                        icon: "IconAdministrative"
                    },
                    {
                        label: this.$t('status.private'),
                        value: 7,
                        icon: "IconPrivate"
                    },
                    {
                        label: this.$t('status.other'),
                        value: 9,
                        icon: "IconOther"
                    },
                    {
                        label: this.$t('status.training'),
                        value: 11,
                        icon: "IconTraining"
                    },
                    {
                        label: this.$t('status.teamMeeting'),
                        value: 12,
                        icon: "IconTeamMeeting"
                    },
                    {
                        label: this.$t('status.brief'),
                        value: 13,
                        icon: "IconBrief"
                    },
                ]
            }
        },
        mounted() {
            this.selectedStatus = this.status;
            this.selectedIcon = this.options.find(elem => elem.value === this.status).icon;
            this.selectedOption = this.options.find(elem => elem.value === this.status);
        },
        methods: {
            onStatusChange(value) {
                let option = this.options.find(elem => elem.value === value);
                this.selectedOption = option;
                this.selectedStatus = option.value;
                this.selectedIcon = option.icon;
            },
            onChange() {
                let objectToEmit = {
                    status: this.selectedStatus,
                    showText: this.showStatusText
                }

                this.$emit('on-change', objectToEmit);
                this.toggleVisibility(false);
            },
            toggleVisibility(value) {
                this.$emit('update:visible', value);
            }
        },
    }
</script>
<style lang="scss">

</style>
