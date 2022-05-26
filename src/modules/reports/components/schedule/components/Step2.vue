<template>
    <div class="content-wrapper">
        <el-form>
            <el-form-item class="relative">
                <label>{{ $t('general.to') }}</label>
                <div class="w-full">
                    <el-select
                        id="email-wrapper"
                        class="w-full"
                        v-model="recipients"
                        multiple
                        @change="tryAddEmail"
                        filterable
                        allow-create
                        default-first-option
                        :placeholder="$t('report.recipients')"
                    >
                        <el-option
                            v-for="(item, index) in reportRecipients"
                            :key="`recipient-${index}`"
                            :label="item.text"
                            :value="item.value"
                        >
                            <span>{{ item.text }} ({{ $t(`general.${item.type}`) }})</span>
                        </el-option>
                    </el-select>
                </div>
                <div class="el-form-item__error" v-show="isRecipientsListIsEmpty">
                    {{ $t('validation.error.fieldIsRequired') }}
                </div>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('report.subject') }}</label>
                <html-editor
                    :has-buttons="hasButtons"
                    ref="editor"
                    v-model="model.subject"
                    :config="{
                        plugins: ['variable'],
                        minHeight: '150px',
                        focus: false
                    }"
                    :availableVariables="reportTemplateVariableList"
                    :buttonsHide="['html', 'format', 'bold', 'italic', 'lists', 'link', 'Strikethrough', 'imagemanager', 'image', 'deleted']"
                    @change="onChangeSubject"
                />
            </el-form-item>
            <el-form-item>
                <label>{{ $t('report.editor.text') }}</label>
                <html-editor
                    :has-buttons="hasButtons"
                    ref="editor"
                    :value="model.text"
                    :config="{
                        plugins: ['variable'],
                        minHeight: '200px',
                        focus: false
                    }"
                    :availableVariables="reportTemplateVariableList"
                    :buttonsHide="['html', 'format', 'bold', 'italic', 'lists', 'link', 'Strikethrough', 'imagemanager', 'image', 'deleted']"
                    @change="onChangeText"
                />
            </el-form-item>
        </el-form>
        <portal to="next-button">
            <div class="flex">
                <div
                    @click="onBack"
                    class="text-primary-300 flex items-center hover:text-primary cursor-pointer mx-16"
                >
                    <IconDirLeft/>
                    <span class="mx-1">{{ $t('general.back') }}</span>
                </div>
                <base-button
                    fixed-width="w-37"
                    size="md"
                    type="primary"
                    @click="onFinish"
                >
                    <div class="flex items-center">
                        <IconSave class="mx-1"/>
                        <span class="mx-1 text-base font-bold">
                            {{ $t('general.finish') }}
                        </span>
                    </div>
                </base-button>
            </div>
        </portal>
    </div>
</template>
<script>
    import { Select, Option } from 'element-ui'
    import { validateEmail } from '@/helpers/util'
    import { reportTriggerApi } from "@/modules/reports/services/reportTriggerService"
    import cloneDeep from 'lodash/cloneDeep'

    const ReportRecipientTypeIDS = {
        User: 1,
        Account: 2,
        Email: 3
    }

    export default {
        props: {
            report: {
                type: Object,
                default: () => ({}),
            },
        },
        inject: ['dataToEdit'],
        components: {
            HtmlEditor: () => import('@/components/Html/HtmlEditor'),
            [Select.name]: Select,
            [Option.name]: Option
        },
        data() {
            return {
                hasButtons: false,
                recipients: [],
                model: {
                    subject: '',
                    text: ''
                },
                locale: {
                    subject: '',
                    text: ''
                },
                isRecipientsListIsEmpty: false
            }
        },
        computed: {
            reportTemplateVariableList() {
                return this.$store.getters['reportTrigger/getConfData'].ReportTemplateVariableList
                    .map(el => {
                        return {
                            text: this.$t(el.ReportTemplateVariableNameTag),
                            value: el.ReportTemplateVariableTag
                        }
                    })
            },
            getReportTriggerData () {
                return this.$store.getters['reportTrigger/getReportTriggerData']
            },
            allAccounts () {
                return this.$store.getters['entities/getEntityList']('Accounts')
                    .map(el => {
                        return {
                            text: el.dist_name,
                            value: el.AccountID,
                            type: 'account'
                        }
                    })
            },
            allUsers () {
                return this.$store.getters['entities/getEntityList']('Users')
                    .map(el => {
                        return {
                            text: el.user_name,
                            value: el.user_id,
                            type: 'user'
                        }
                    })
            },
            reportRecipients () {
                const allAccounts = this.allAccounts
                const allUsers = this.allUsers

                return allAccounts.concat(allUsers)
            },
            recipientsLength () {
                return this.recipients.length
            },
            getCreateLocalReportTrigger () {
                return this.$store.state.reportTrigger.createLocalReportTrigger
            }
        },
        watch: {
            recipientsLength (val) {
                this.isRecipientsListIsEmpty = !val
            }
        },
        methods: {
            async onFinish() {
                this.isRecipientsListIsEmpty = !this.recipientsLength
                if (!this.recipientsLength) {

                    return
                }
                await this.updateReportTriggerRecipientsData()
                const reportTriggerData = await this.updateReportTriggerData()

                if (this.getCreateLocalReportTrigger) {
                    if (!this.dataToEdit || !Object.keys(this.dataToEdit).length) {
                        await this.$store.dispatch('report/pushReportTriggerData', reportTriggerData)
                    } else {
                        const data = {
                            indexToEdit: this.dataToEdit.indexToEdit,
                            value: reportTriggerData
                        }
                        await this.$store.dispatch('report/updateReportTriggerItem', data)
                    }
                    this.$emit('on-finish')
                    return
                }

                try {
                    await reportTriggerApi.createReportTrigger(reportTriggerData)
                    this.$emit('on-finish')
                } catch {

                }
            },
            tryAddEmail(values) {
                const targetItem = values[values.length - 1]
                if (validateEmail(targetItem) || (/^-?\d+$/.test(targetItem) && this.reportRecipients.some(el => Number(el.value) === Number(targetItem)))) {
                    return
                }

                if (!validateEmail(targetItem) || /^-?\d+$/.test(targetItem)) {
                    const indexToRemove = this.recipients.indexOf(targetItem)
                    if (indexToRemove !== -1) {
                        this.recipients.splice(indexToRemove, 1)
                    }
                }
            },
            async onBack () {
                await this.updateReportTriggerRecipientsData()

                this.$emit('on-back')
            },
            searchReportRecipientTypeIDById (id) {
                const user = this.allUsers.find(el => Number(el.value) === Number(id))
                const account = this.allAccounts.find(el => Number(el.value) === Number(id))

                if (user) {
                    return ReportRecipientTypeIDS.User
                }
                if (account) {
                    return ReportRecipientTypeIDS.Account
                }
                return
            },
            onChangeSubject (msg) {
                this.replaceHTMLTagsAndVariables(msg, 'subject')
            },
            onChangeText (msg) {
                this.replaceHTMLTagsAndVariables(msg, 'text')
            },
            replaceHTMLTagsAndVariables (message, typeOfMsg) {
                let msg = message.replace(new RegExp('<[^>]*>', 'g'), '').replace('&nbsp;', ' ')
                this.reportTemplateVariableList.forEach(el => {
                    msg = msg.replaceAll(el.text, el.value)
                });
                this.locale[typeOfMsg] = msg
            },
            async updateReportTriggerRecipientsData () {
                const recipients = this.recipients.map(el => {
                    let newObject = {}
                    if (/^-?\d+$/.test(el)) {
                        newObject.RecipientID = el,
                        newObject.ReportRecipientTypeID = this.searchReportRecipientTypeIDById(el)
                    } else {
                        newObject.Email = el
                        newObject.ReportRecipientTypeID = ReportRecipientTypeIDS.Email
                    }

                    return newObject
                })

                const data = {
                    EmailSubject: this.locale.subject,
                    EmailBody: this.locale.text,
                    ReportRecipient: recipients
                }

                await this.$store.dispatch('reportTrigger/updateReportTriggerData', data)
            },
            async updateReportTriggerData () {
                const data = cloneDeep(this.getReportTriggerData)

                if (data.ReportTriggerCondition.length) {
                    data.ReportTriggerCondition = data.ReportTriggerCondition
                        .map(condition => {
                            const filteredReportTriggerConditionFilter = condition.ReportTriggerConditionFilter.filter(el => el.WidgetID)

                            return filteredReportTriggerConditionFilter.length ? condition : {}
                        })
                } else {
                    data.ReportTriggerCondition = [{}]
                }

                if ('TriggerTimeRange' in data.ScheduleData) {
                    const timeRange = data.ScheduleData.TriggerTimeRange
                    data.ScheduleData.TriggerTimeRange = {
                        Start: timeRange[0],
                        End: timeRange[1]
                    }
                }
                if ('TriggerDayOfWeek' in data.ScheduleData) {
                    data.ScheduleData.TriggerDayOfWeek.sort((a, b) => a - b)
                }
                return data
            }
        },
        mounted () {
            if (this.getReportTriggerData.ReportRecipient) {
                this.recipients = this.getReportTriggerData.ReportRecipient.map(el => el.Email || el.RecipientID)
            }
            if (this.getReportTriggerData.EmailSubject && this.getReportTriggerData.EmailBody) {
                this.model.subject = this.getReportTriggerData.EmailSubject
                this.model.text = this.getReportTriggerData.EmailBody
            } else {
                this.model.subject = this.$t('report.trigger.email.subject')
                this.model.text = this.$t('report.trigger.email.body')
            }
        }
    }
</script>

<style lang="scss" scoped>
[dir="rtl"] .el-form {
    @apply text-right;
}
[dir="ltr"] .el-form {
    @apply text-left;
}
</style>
