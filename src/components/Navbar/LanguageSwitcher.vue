<template>
    <el-select v-model="activeLanguage"
               value-key="locale"
               filterable
               class="language-select px-1 flex items-center"
               ref="select">
        <img class="w-6 h-5 mr-2"
             @click="focusSelect"
             :src="activeLanguage.icon"
             :alt="activeLanguage.name"
             slot="prefix">
        <el-option v-for="language in languages"
                   class="flex items-center"
                   :label="language.name"
                   :value="language"
                   :key="language.locale">
            <div class="flex items-center">
                <img
                    :src="language.icon"
                    :alt="language.name"
                    class="w-6 h-5 mr-2"
                    :class="{'mr-0 ml-2': $rtl.isRTL}">
                <span>{{language.name}}</span>
            </div>
        </el-option>
    </el-select>
</template>

<script>
    import languages from './languages'
    import {Option, Select} from 'element-ui'

    export default {
        name: 'language-switcher',
        components: {
            ElSelect: Select,
            ElOption: Option
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            label: String,
            prefix: {
                type: String,
                default: ''
            },
            detectCountry: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                languages,
                activeLanguage: {}
            }
        },
        methods: {
            focusSelect() {
                this.$refs.select.focus()
            }
        },
        watch: {
            activeLanguage(newVal) {
                this.$emit('change', newVal.locale)
            },
            value: {
                immediate: true,
                handler: function (newVal) {
                    let lang = this.languages.find(l => l.locale === newVal)
                    if (lang) {
                        this.activeLanguage = lang
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .language-select /deep/ {
        .el-input__inner,
        .el-input.is-focus .el-input__inner {
            width: 25px;
        }

        .el-input__prefix {
            @apply flex items-center;
        }
    }
</style>
