<template>
    <div class="editor__wrapper" :class="{'pointer-events-none' : !editMode}">
        <div :id="toolbarId">
            <div class="flex w-full justify-between items-center">
                <div class="flex ql-formats w-auto">
                    <select class="ql-header"></select>
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>
                    <button type="button" class="ql-list" value="ordered"></button>
                    <button type="button" class="ql-list" value="bullet"></button>
                    <button type="button" class="ql-clean"></button>
                </div>
                <div class="flex">
                    <el-tooltip class="item" effect="dark" :content="$t('common.revert.changes')" placement="top">
                        <XIcon class="w-5 h-5 text-red cursor-pointer mx-2" @click="onRevert()"/>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('common.save.changes')" placement="top">
                        <CheckIcon class="w-5 h-5 text-green cursor-pointer" @click="onUpdate()"/>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div :id="editorId" :name="name" class="" ref="editor">
        </div>
    </div>
</template>
<script>
    import Quill from 'quill'
    import 'quill/dist/quill.snow.css'
    import {Tooltip} from 'element-ui'
    import {CheckIcon, XIcon} from 'vue-feather-icons'

    export default {
        components: {
            CheckIcon,
            XIcon,
            [Tooltip.name]: Tooltip,
        },
        props: {
            value: {
                type: [String, Object],
                default: ''
            },
            name: String,
            editMode: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                editor: null,
                content: null,
                lastHtmlValue: '',
                editorId: null,
                toolbarId: null
            }
        },
        methods: {
            initialize() {
                this.editor = new Quill(`#${this.editorId}`, {
                    theme: 'snow',
                    modules: {
                        toolbar: `#${this.toolbarId}`
                    }
                })

                if (this.value.length > 0) {
                    this.editor.pasteHTML(this.value)
                }

                let editorRef = this.$refs.editor;
                let node = editorRef.children[0];
                this.editor.on('text-change', () => {
                    let html = node.innerHTML
                    if (html === '<p><br></p>') {
                        html = '';
                    }
                    this.content = html
                })
            },
            pasteHTML() {
                this.editor.pasteHTML(this.value)
            },
            randomString() {
                let text = "";
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

                for (let i = 0; i < 5; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
            onRevert() {
                this.$nextTick(this.initialize);
            },
            onUpdate() {
                this.$emit('on-update', this.content);
            },
        },
        mounted() {
            this.editorId = this.randomString();
            this.toolbarId = this.randomString();
            this.$nextTick(this.initialize);
        },
        watch: {
            value(newVal) {
                if (newVal !== this.content) {
                    this.editor.pasteHTML(newVal);
                }
            },
            editMode() {
                this.$nextTick(this.initialize);
            },
        }
    }
</script>
<style lang="scss">
    .ql-toolbar {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        min-height: 45px;
        @apply border text-gray-200 bg-gray-200;
        display: flex;
    }

    .ql-toolbar .ql-formats {
        @apply bg-white;
        margin-right: 0;
        padding-right: 15px;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .ql-container {
        border-bottom-left-radius: 4px;
        @apply border text-black bg-white rounded;
        height: 280px;
    }

    .ql-editor {
        padding: 20px;
    }

    .ql-editor p {
        margin: 5px 0;
    }

    .ql-clipboard {
        white-space: normal;
    }

    .editor-tag {
        display: inline-flex;
        padding: 7px 10px;
        min-width: 100px;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
    }

    .editor__extra-tools {
        display: inline-flex;
        align-items: center;
        margin-left: 30px;
        flex: 1;
        justify-content: flex-end;
    }
</style>
