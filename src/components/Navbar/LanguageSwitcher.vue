<template>
    <el-select v-model="activeLanguage"
               value-key="locale"
               filterable
               class="language-select select-default"
               ref="select">
        <img class="language-option__icon selected-language__icon"
             @click="focusSelect"
             :src="activeLanguage.icon"
             :alt="activeLanguage.name"
             slot="prefix">
        <el-option v-for="language in languages"
                   class="language-option__item select-default"
                   :label="language.name"
                   :value="language"
                   :key="language.locale">
            <div class="language-option">
                <img :src="language.icon" :alt="language.name" class="language-option__icon">
                <span class="language-option__text">{{language.name}}</span>
            </div>
        </el-option>
    </el-select>
</template>

<script>
    import languages from './languages'
    import {Select, Option} from 'element-ui'

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

<style lang="scss">
    //TODO: update this css with new design
    .language-select .el-input__inner,
    .language-select .el-input.is-focus .el-input__inner {
        width: 25px;
    }

    .language-select {
        display: flex;
        align-items: center;
        padding: 0 15px;

        .el-input__prefix {
            display: flex;
            align-items: center;
        }
    }

    .language-option {
        display: flex;
        margin-top: 5px;
        margin-bottom: 5px;
        align-items: center;
    }

    .language-option__icon {
        width: 25px;
        height: 20px;
        margin-right: 10px;
    }

    .rtl {
        .el-select-dropdown .language-option__icon {
            margin-right: 0;
            margin-left: 10px;
        }
    }

    .selected-language__icon {
        cursor: pointer;
    }

    .el-select-dropdown__item.language-option__item {
        display: flex;
        align-items: center;
    }
</style>
