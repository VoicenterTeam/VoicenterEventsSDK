<template>
    <div>
        <div class="flex items-center mb-4">
            <div class="flex flex-col md:flex-row md:items-center">
                <p v-if="data.Title" class="text-main-2xl font-semibold">
                    {{data.Title}}
                </p>
            </div>
        </div>
        <div class="bg-white p-4 rounded-lg py-4 mt-4 widget-container">
            <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                <div class="menubar">
                    <div class="flex items-center border px-2 rounded">
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
                </div>
            </editor-menu-bar>
            <editor-content
                class="editor__content"
                :editor="editor"/>
        </div>
    </div>
</template>

<script>
    import TrixIcon from '../../Common/Trix/TrixIcon'
    import {baseButtons} from '../../Common/Trix/TrixButtons'
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
        },
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                baseButtons,
                editor: new Editor({
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
                        new TableHeader(),
                        new TableCell(),
                        new TableRow(),
                    ],
                    // editable: false,
                    content: `
            <h2>
              Tables
            </h2>
            <p>
              Tables come with some useful commands like adding, removing or merging rows and columns. Navigate with <code>tab</code> or arrow keys. Resizing is also supported.
            </p>
            <table>
              <tr>
                <th colspan="3" data-colwidth="100,0,0">Wide header</th>
              </tr>
              <tr>
                <td>One</td>
                <td>Two</td>
                <td>Three</td>
              </tr>
              <tr>
                <td>Four</td>
                <td>Five</td>
                <td>Six</td>
              </tr>
            </table>
          `
                }),
            }
        },
        beforeDestroy() {
            this.editor.destroy()
        },
    }
</script>
<style lang="scss" scoped>
    .widget-container /deep/ {

        @import "../../../assets/css/widgets/trix.scss";

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
            @apply border rounded p-2 outline-none;
        }
    }
</style>
