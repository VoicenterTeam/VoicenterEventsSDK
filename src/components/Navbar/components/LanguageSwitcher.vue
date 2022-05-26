<template>
    <div class="w-29">
        <el-select
            v-model="activeLanguage"
            value-key="locale"
            label-key="abbName"
            placeholder=""
            class="language-select flex items-center text-sm font-medium"
            @change="onLocaleChange">
            <template v-slot:prefix>
                <div class="flex items-center"
                    :class="{'ml-10': $rtl.isRTL}"
                >
                    <img class="w-6 h-4 mx-2 text-sm"
                        :src="activeLanguage.icon"
                        :alt="activeLanguage.name"
                    >
                    {{ activeLanguage.abbName }}
                </div>
            </template>
            <el-option
                v-for="(language, index) in languages"
                class="flex items-center justify-between"
                :value="language"
                :key="`${language.locale}-${index}`"
            >
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

    export default {
        components: {
            ElSelect: Select,
            ElOption: Option,
        },
        props: {
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
        computed: {
            languages() {
                return this.$store.getters['lang/getLanguageList']
            },
            activeLanguage: {
                get () {
                    return this.$store.getters['lang/getActiveLanguage'] || {
                        abbName: 'EN',
                        name: 'En',
                        icon: `/img/flags/US.png`
                    }
                },
                set (newVal) {
                    return newVal
                }
            }
        },
        methods: {
            onLocaleChange({ Domain }) {
                const oldLocation = window.location
                const oldDomain = oldLocation.hostname

                window.location = oldLocation.href.replace(oldDomain, Domain)
            }
        }
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
