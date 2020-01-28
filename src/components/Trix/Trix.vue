<template>
    <div class="editor-wrapper">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }" v-if="editMode">
            <div class="menubar flex justify-between px-2 items-center border rounded">
                <div class="flex w-full p-1">
                    <button
                        class="menubar__button"
                        @click="commands.undo"
                    >
                        <icon name="undo"/>
                    </button>
                    <button
                        class="menubar__button"
                        @click="commands.redo"
                    >
                        <icon name="redo"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.bold() }"
                        @click="commands.bold"
                    >
                        <icon name="bold"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.italic() }"
                        @click="commands.italic"
                    >
                        <icon name="italic"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.strike() }"
                        @click="commands.strike"
                    >
                        <icon name="strike"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.underline() }"
                        @click="commands.underline"
                    >
                        <icon name="underline"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.code() }"
                        @click="commands.code"
                    >
                        <icon name="code"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.paragraph() }"
                        @click="commands.paragraph"
                    >
                        <icon name="paragraph"/>
                    </button>
                    <button
                        class="menubar__button text-xs"
                        :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                        @click="commands.heading({ level: 1 })"
                    >
                        H1
                    </button>
                    <button
                        class="menubar__button text-xs"
                        :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                        @click="commands.heading({ level: 2 })"
                    >
                        H2
                    </button>
                    <button
                        class="menubar__button text-xs"
                        :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                        @click="commands.heading({ level: 3 })"
                    >
                        H3
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.bullet_list() }"
                        @click="commands.bullet_list"
                    >
                        <icon name="ul"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.ordered_list() }"
                        @click="commands.ordered_list"
                    >
                        <icon name="ol"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.blockquote() }"
                        @click="commands.blockquote"
                    >
                        <icon name="quote"/>
                    </button>
                    <button
                        class="menubar__button"
                        :class="{ 'is-active': isActive.code_block() }"
                        @click="commands.code_block"
                    >
                        <icon name="code"/>
                    </button>
                    <button
                        class="menubar__button"
                        @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                    >
                        <icon name="table"/>
                    </button>
                    <div class="flex" v-if="isActive.table()">
                        <button
                            class="menubar__button"
                            @click="commands.deleteTable"
                        >
                            <icon name="delete_table"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.addColumnBefore"
                        >
                            <icon name="add_col_before"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.addColumnAfter"
                        >
                            <icon name="add_col_after"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.deleteColumn"
                        >
                            <icon name="delete_col"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.addRowBefore"
                        >
                            <icon name="add_row_before"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.addRowAfter"
                        >
                            <icon name="add_row_after"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.deleteRow"
                        >
                            <icon name="delete_row"/>
                        </button>
                        <button
                            class="menubar__button"
                            @click="commands.toggleCellMerge"
                        >
                            <icon name="combine_cells"/>
                        </button>
                    </div>
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
        </editor-menu-bar>
        <editor-content
            class="editor__content"
            :editor="editor"/>
    </div>
</template>

<script>
    import {Tooltip} from 'element-ui'
    import {CheckIcon, XIcon} from 'vue-feather-icons'
    import TrixIcon from './TrixIcon'
    import {Editor, EditorContent, EditorMenuBar} from 'tiptap'
    import {
        Blockquote,
        Bold,
        BulletList,
        Code,
        CodeBlock,
        HardBreak,
        Heading,
        History,
        Image,
        Italic,
        Link,
        ListItem,
        OrderedList,
        Strike,
        Table,
        TableCell,
        TableHeader,
        TableRow,
        TodoItem,
        TodoList,
        Underline,
    } from 'tiptap-extensions'

    export default {
        components: {
            EditorContent,
            EditorMenuBar,
            [TrixIcon.name]: TrixIcon,
            [Tooltip.name]: Tooltip,
            CheckIcon,
            XIcon,
        },
        props: {
            data: {
                type: Object,
                default: ``
            },
            editMode: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                trixState: '',
                editor: null
            }
        },
        methods: {
            initEditor() {
                this.destroyEditor()
                this.editor = new Editor({
                    extensions: [
                        new Blockquote(),
                        new BulletList(),
                        new CodeBlock(),
                        new HardBreak(),
                        new Heading({levels: [1, 2, 3]}),
                        new ListItem(),
                        new OrderedList(),
                        new TodoItem(),
                        new TodoList(),
                        new Link(),
                        new Bold(),
                        new Code(),
                        new Italic(),
                        new Strike(),
                        new Underline(),
                        new History(),
                        new Table({
                            resizable: true,
                        }),
                        new Image(),
                        new TableHeader(),
                        new TableCell(),
                        new TableRow(),
                    ],
                    editable: this.editMode,
                    content: this.data,
                    onUpdate: ({getJSON}) => {
                        this.trixState = getJSON()
                    }
                })
            },
            destroyEditor() {
                if (this.editor) {
                    this.editor.destroy()

                }
            },
            onUpdate() {
                this.$emit('on-update', this.trixState)
            },
            onRevert() {
                this.editor.setContent(this.data)
            },
        },
        beforeDestroy() {
            this.destroyEditor()
        },
        mounted() {
            this.initEditor()
        },
        watch: {
            data: {
                handler(data) {
                    this.editor.setContent(data)
                }
            },
            editMode() {
                this.initEditor()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .editor-wrapper /deep/ {
        @import "../../assets/css/widgets/trix";

        ol {
            list-style: decimal;
        }

        ul {
            list-style: disc;
        }

        h1 {
            font-size: 2em;
        }

        h2 {
            font-size: 1.5em;
        }

        h3 {
            font-size: 1.17em;
        }

        .editor__content {
            @apply p-2 outline-none;
        }
    }
</style>
