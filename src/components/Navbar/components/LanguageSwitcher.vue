<template>
    <div class="w-29">
        <el-select v-model="language"
                   value-key="locale"
                   label-key="abbName"
                   placeholder=""
                   class="language-select flex items-center text-sm font-medium"
                   @change="onLocaleChange(language.locale)">
            <template v-slot:prefix>
                <div class="flex items-center"
                     :class="{'ml-10': $rtl.isRTL}">
                    <img class="w-6 h-4 mx-2 text-sm"
                         :src="language.icon"
                         :alt="language.name"
                    >
                    {{ language.abbName }}
                </div>
            </template>
            <el-option v-for="language in languages"
                       class="flex items-center justify-between"
                       :value="language"
                       :key="language.locale">
                <div class="flex items-center">
                    <img :src="language.icon"
                         :alt="language.name"
                         class="w-6 h-4"
                    >
                    <span class="mx-2">
                    {{ language.name }}
                </span>
                </div>
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import { Option, Select } from 'element-ui'
    import languages from '@/components/Navbar/components/languages'
    
    export default {
        components: {
            ElSelect: Select,
            ElOption: Option,
        },
        props: {
            currentLanguage: {
                type: String,
                default: '',
            },
            label: String,
            prefix: {
                type: String,
                default: '',
            },
            detectCountry: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                languages,
                language: {},
            }
        },
        computed: {
            activeLanguage() {
                return localStorage.getItem('locale') || this.$i18n.locale
            },
        },
        methods: {
            onLocaleChange(val) {
                this.$store.dispatch('lang/setLanguage', val)
                this.$i18n.locale = val
                
                val === 'he' ? this.$rtl.enableRTL() : this.$rtl.disableRTL()
            },
        },
        watch: {
            activeLanguage: {
                immediate: true,
                handler(val) {
                    let lang = this.languages.find(l => l.locale === val)
                    if (!lang) {
                        this.language = this.$i18n.locale
                        return
                    }
                    this.language = lang
                },
            },
        },
    }
</script>
<style lang="scss" scoped>
.language-select ::v-deep {
    @apply cursor-pointer;
    .el-select {
        @apply w-full;
    }
    .el-input__inner {
        @apply rounded shadow h-10;
        border: none;
        box-shadow: 0 0 5px var(--gray-350);
    }
    
    .el-input__prefix {
        @apply flex items-center text-gray-900;
    }
    
    ::v-deep .el-select-dropdown__list {
        padding: 0;
    }
}
</style>
