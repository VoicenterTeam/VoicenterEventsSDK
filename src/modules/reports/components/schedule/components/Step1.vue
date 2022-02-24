<template>
    <div class="content-wrapper">
        <el-form>
            <el-form-item>
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
                        />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('report.subject') }}</label>
                <html-editor
                    :has-buttons="hasButtons"
                    ref="editor"
                    :value="model.subject"
                    :config="{
                        plugins: ['variable'],
                        imageResizable: true,
                        imagePosition: true,
                        minHeight: '200px',
                        focus: false
                    }"
                    :availableVariables="reportTemplateVariableList"
                    :buttonsHide="['html', 'format', 'bold', 'italic', 'lists', 'link', 'Strikethrough', 'imagemanager', 'image', 'deleted']"
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
                        imageResizable: true,
                        imagePosition: true,
                        minHeight: '200px',
                        focus: false
                    }"
                    :availableVariables="reportTemplateVariableList"
                    :buttonsHide="['html', 'format', 'bold', 'italic', 'lists', 'link', 'Strikethrough', 'imagemanager', 'image', 'deleted']"
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
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import { makeRandomID, validateEmail } from '@/helpers/util'

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
        components: {
            HtmlEditor,
            [Select.name]: Select,
            [Option.name]: Option,
        },
        data() {
            return {
                hasButtons: false,
                recipients: [],
                model: {
                    subject: '',
                    text: ''
                }
            }
        },
        computed: {
            reportTemplateVariableList() {
                return this.$store.getters['report/getConfData'].ReportTemplateVariableList
                    .map(el => {
                        return {
                            text: this.$t(el.ReportTemplateVariableNameTag),
                            value: el.ReportTemplateVariableTag
                        }
                    })
            },
            getReportData () {
                return this.$store.getters['report/getReportData']
            },
            allAccounts () {
                return this.$store.getters['entities/getEntityList']('Accounts')
                    .map(el => {
                        return {
                            text: el.dist_name,
                            value: el.AccountID
                        }
                    })
            },
            allUsers () {
                return this.$store.getters['entities/getEntityList']('Users')
                    .map(el => {
                        return {
                            text: el.user_name,
                            value: el.user_id
                        }
                    })
            },
            reportRecipients () {
                const allAccounts = this.allAccounts
                const allUsers = this.allUsers

                return allAccounts.concat(allUsers)
            }
        },
        methods: {
            onFinish() {
                alert('onFinish')
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
            onBack () {
                console.log(this.model)
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
                    EmailSubject: this.model.subject,
                    EmailBody: this.model.text,
                    ReportTriggerRecipient: recipients
                }
                this.$store.dispatch('report/updateReportData', data)

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
            }
        },
        mounted () {
            if (this.getReportData.ReportTriggerRecipient) {
                this.recipients = this.getReportData.ReportTriggerRecipient.map(el => el.Email || el.RecipientID)
            }
            if (this.getReportData.EmailSubject && this.getReportData.EmailBody) {
                console.log(1)
                this.model.subject = this.getReportData.EmailSubject
                this.model.text = this.getReportData.EmailBody
            } else {
                console.log(2)
                this.model.subject = this.$t('report.trigger.email.subject')
                this.model.text = this.$t('report.trigger.email.body')
            }
        }
    }
</script>
