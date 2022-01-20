<template>
    <div class="content-wrapper">
        <el-form>
            <el-form-item>
                <label>{{ $t('To') }}</label>
                <div class="w-full">
                    <el-select id="email-wrapper"
                               class="w-full"
                               v-model="recipients"
                               multiple
                               @change="tryAddEmail"
                               filterable
                               allow-create
                               default-first-option
                               :placeholder="$t('Recipients')"
                    >
                        <el-option v-for="(item, index) in report.ReportRecipient"
                                   :key="`recipient-${index}-${item.Email}`"
                                   :label="item.Email"
                                   :value="item.ReportRecipientID"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('Subject') }}</label>
                <el-input :placeholder="$t('report.emailSubject')"
                          v-model="model.subject"/>
            </el-form-item>
            <el-form-item>
                <label>{{ $t('Text') }}</label>
                <html-editor :has-buttons="hasButtons"
                             ref="editor"
                             :value="model.text"
                />
            </el-form-item>
        </el-form>
        <portal to="next-button">
            <base-button fixed-width="w-37"
                         size="md"
                         @click="onFinish">
                <div class="flex items-center">
                    <IconSave class="mx-1"/>
                    <span class="mx-1 text-base font-bold">
                        {{ $t('Finish') }}
                    </span>
                </div>
            </base-button>
        </portal>
    </div>
</template>
<script>
    import cloneDeep from 'lodash/cloneDeep'
    import { Select, Option } from 'element-ui'
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import { makeRandomID, validateEmail } from '@/helpers/util'
    import { recipientObject } from '@/modules/reports/enum/report'
    
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
                    text: '',
                },
            }
        },
        methods: {
            onFinish() {
                alert('onFinish')
            },
            tryAddEmail(values) {
                console.log({ values })
                if (values || !values.length) {
                    return
                }
                
                const ReportRecipientID = makeRandomID()
                let targetItem = values.pop()
                targetItem = recipientObject()
                
                if (validateEmail(targetItem)) {
                    values.push(targetItem)
                }
            },
            fillRecipients(report) {
                this.model.recipients = cloneDeep(report.ReportRecipient)
            },
        },
        watch: {
            report: {
                deep: true,
                immediate: true,
                handler(value) {
                    if (!value) {
                        return
                    }
                    this.fillRecipients(value)
                },
            },
        },
    }
</script>
