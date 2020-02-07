<template>
    <div class="relative">
        <textarea ref="redactor" :name="name" :placeholder="placeholder" :value="value"/>
        <div class="flex save-buttons">
            <el-tooltip class="item" effect="dark" :content="$t('common.revert.changes')" placement="top">
                <XIcon class="w-6 h-6 text-red cursor-pointer mx-2" @click="onRevert()"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('common.save.changes')" placement="top">
                <CheckIcon class="w-6 h-6 text-green cursor-pointer" @click="onUpdate()"/>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
    import { Tooltip } from 'element-ui'
    import { CheckIcon, XIcon } from 'vue-feather-icons'
    import '@/assets/vendor/redactor/_scss/redactor.scss'

    export default {
        name: 'html-editor',
        redactor: false,
        components: {
            CheckIcon,
            XIcon,
            [Tooltip.name]: Tooltip,
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: String,
                default: '',
            },
            placeholder: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            },
            editMode: {
                type: Boolean,
                default: true
            },
            config: {
                type: Object,
                default: () => ({
                    plugins: ['alignment', 'fontcolor', 'fontsize', 'imagemanager'],
                    imageResizable: true,
                    imagePosition: true
                }),
            }
        },
        data() {
            return {
                currentContent: this.value
            }
        },
        watch: {
            value(newValue) {
                if (!this.redactor) {
                    return
                }
                const editor = this.redactor.editor;
                if (editor.isFocus() || editor.isSourceMode()) {
                    return
                }

                this.redactor.source.setCode(newValue || '')
            },
            '$rtl.isRTL'(isRTL) {
                const dir = isRTL ? 'rtl' : 'ltr'
                if (!this.redactor) {
                    return
                }
                window.$R(this.$refs.redactor, 'destroy')
                this.init()
            }
        },
        async mounted() {
            await import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/redactor')
            await Promise.all([
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_langs/en.js'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_langs/he.js'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_plugins/imagemanager/imagemanager'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_plugins/definedlinks/definedlinks'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_plugins/alignment/alignment'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_plugins/fontsize/fontsize'),
                import(/* webpackChunkName: "redactor" */ '@/assets/vendor/redactor/_plugins/fontcolor/fontcolor'),
            ])
            this.init()
        },
        methods: {
            fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })
            },
            init() {
                try {
                    const callbacks = {
                        changed: html => {
                            this.handleInput(html)
                            return html
                        },
                        image: {
                            uploadError: (response) => {
                                console.warn(response.message);
                            }
                        },
                    };
                    const target = document.querySelector('#block-settings-sidebar .sidebar__content')
                    this.$set(this.config, 'callbacks', callbacks);
                    const finalConfig = {
                        ...this.config,
                        toolbarFixedTarget: target,
                        lang: this.$i18n.locale,
                        direction: this.$rtl.isRTL ? 'rtl' : 'ltr',
                        imageUpload: async (data, files, e, upload) => {
                            if (!files || !files.length) {
                                return ''
                            }
                            try {
                                const file = files[0]
                                const imgSrc = await this.fileToBase64(file)
                                upload.complete({
                                    file: {
                                        url: imgSrc,
                                        id: imgSrc
                                    }
                                })
                            } catch (e) {
                                upload.complete({
                                    error: true,
                                    message: this.$t('html.editor.image.upload.error')
                                })
                            }
                        }
                    }
                    // in case the target doesn't exist, delete it
                    if (!target) {
                        delete finalConfig.toolbarFixedTarget
                    }
                    const app = window.$R(this.$refs.redactor, finalConfig);
                    // set instance
                    this.redactor = app;
                    this.$parent.redactor = app;
                } catch (e) {
                    console.warn('Redactor init error', e)
                }
            },
            handleInput(val) {
                this.currentContent = val
                this.$emit('change', val);
            },
            onRevert() {
                this.$emit('on-update', this.value);
            },
            onUpdate() {
                const content = this.currentContent || this.value
                this.$emit('on-update', content);
            },
        }
    }
</script>
<style scoped>
    .save-buttons {
        @apply absolute;
        right: 10px;
        top: 15px;
        z-index: 100;
    }
    .rtl .save-buttons {
        left: 10px;
        right: inherit;
    }
</style>
