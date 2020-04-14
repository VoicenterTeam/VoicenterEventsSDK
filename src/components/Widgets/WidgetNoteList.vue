<template>
    <div class="note-list-editor">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-0-5">
            <div class="flex">
                <base-widget-title :title="data.Title"/>
            </div>
            <div :class="getClass" class="flex items-center" v-if="!creationMode">
                <el-tooltip :content="$t('tooltip.set.edit.mode')" class="item" effect="dark" placement="top">
                    <el-switch class="mx-2" v-model="editMode"/>
                </el-tooltip>
                <el-tooltip :content="$t('Add New Note')" class="item" effect="dark" placement="top">
                    <AddButton @click="onAddNote"/>
                </el-tooltip>
            </div>
        </div>
        <div class="w-full py-2" v-if="creationMode">
            <html-editor
                @on-update="addNote"/>
        </div>
        <div class="mt-2 border-t-2">
            <div class="note-container" v-for="(note, index) in fetchNotes">
                <div :key="index" class="flex flex-col">
                    <div class="pb-2 flex flex-row justify-between">
                        {{getCreationDetails(note)}}
                        <div class="actions cursor-pointer hidden" v-if="!editMode">
                            <el-tooltip :content="$t('Hide note from list')" class="item" effect="dark"
                                        placement="top">
                                <eye-off-icon @click="displayNoteInList(false, note)" class="w-4"></eye-off-icon>
                            </el-tooltip>
                            <el-tooltip :content="$t('Open edit mode for this note')" class="item" effect="dark"
                                        placement="top">
                                <edit-3-icon @click="onEditNote(note)" class="w-4 mx-2"></edit-3-icon>
                            </el-tooltip>
                            <el-tooltip :content="$t('Remove note')" class="item" effect="dark"
                                        placement="top">
                                <trash-2-icon @click="removeNote(note)" class="w-4"></trash-2-icon>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="text-main-sm">
                        <html-editor
                            :value="note.text"
                            @on-update="(data) => updateNote(data, note)"
                            v-if="editMode || noteToUpdate === note.date">
                            <template v-slot:additional_actions>
                                <el-tooltip :content="$t('Display note on the list')" class="item" effect="dark" placement="top">
                                    <eye-icon @click="displayNoteInList(true, note)" class="w-4 mx-2 cursor-pointer"
                                              v-if="!note.displayed"></eye-icon>
                                </el-tooltip>
                                <el-tooltip :content="$t('Hide note from list')" class="item" effect="dark" placement="top">
                                    <eye-off-icon @click="displayNoteInList(false, note)"
                                                  class="w-4 mx-2 cursor-pointer"
                                                  v-if="note.displayed"></eye-off-icon>
                                </el-tooltip>
                            </template>
                        </html-editor>
                        <div v-else v-html="note.text"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import {Switch, Tooltip} from 'element-ui'
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import AddButton from '@/components/AddButton'
    import {Edit3Icon, EyeIcon, EyeOffIcon, Trash2Icon} from 'vue-feather-icons'

    export default {
        components: {
            [Tooltip.name]: Tooltip,
            [Switch.name]: Switch,
            EyeOffIcon,
            Trash2Icon,
            Edit3Icon,
            AddButton,
            EyeIcon,
            HtmlEditor,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            }
        },
        data () {
            return {
                creationMode: false,
                editMode: this.editable,
                noteToUpdate: null,
            }
        },
        computed: {
            fetchNotes () {
                let allNotes = get(this.data.WidgetLayout, 'Notes', [])
                if (this.editMode) {
                    return allNotes
                }
                return allNotes.filter((note) => note.displayed)
            },
            getClass () {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
            currentUser() {

            }
        },
        methods: {
            getCreationDetails(note) {
                // return User Test note.date
                return'User Test  added a note  - 3 seconds ago'
            },
            onAddNote () {
                this.creationMode = !this.creationMode
                this.editMode = false
            },
            onEditNote (note) {
                this.noteToUpdate = note.date
                this.editMode = false
            },
            addNote (val) {
                this.creationMode = false

                if (val) {
                    let note = this.newNoteObject()
                    note.text = val

                    this.data.WidgetLayout['Notes'].push(note)
                    this.emmitUpdate()
                }
            },
            removeNote (note) {
                let noteIndex = this.getNoteIndex(note)
                this.data.WidgetLayout['Notes'].splice(noteIndex, 1)
                this.emmitUpdate()
            },
            displayNoteInList (state, note) {
                note.displayed = state
                this.fetchAndUpdate(note)
            },
            updateNote (text, note) {
                note.text = text
                this.fetchAndUpdate(note)
            },
            fetchAndUpdate (note) {
                let noteIndex = this.getNoteIndex(note)
                this.data.WidgetLayout['Notes'][noteIndex] = note
                this.emmitUpdate()
            },
            newNoteObject () {
                return {
                    date: new Date().getTime(),
                    text: '',
                    displayed: true,
                }
            },
            getNoteIndex (note) {
                return this.data.WidgetLayout['Notes'].filter((el) => el.date === note.date)
            },
            emmitUpdate () {
                this.$emit('on-update', this.data)
                this.noteToUpdate = null
            }
        },
        mounted () {
            if (!this.data.WidgetLayout['Notes']) {
                this.data.WidgetLayout['Notes'] = []
            }
        }
    }
</script>
<style lang="scss" scoped>
    .note-list-editor {
        .note-container {
            @apply p-3 rounded border-b-2;
            &:hover {
                @apply bg-primary-200;
                .actions {
                    @apply flex;
                }
            }
        }
    }
</style>
