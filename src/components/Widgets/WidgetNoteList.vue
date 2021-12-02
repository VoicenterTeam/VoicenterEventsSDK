<template>
    <div class="px-1">
        <modal :visible.sync="creationMode"
               :width="dialogWidth">
            <div class="pb-4">
                <html-editor
                    @on-update="addNote"
                    v-if="creationMode"/>
            </div>
        </modal>
        <div class="flex flex-row justify-between" v-for="(note, index) in fetchNotes" :key="index">
            <div class="border p-2 w-48 text-center">
                {{getFormattedDate(note.date)}}
            </div>
            <div class="border p-2 flex-1">
                <div class="text-main-sm">
                    <html-editor
                        :value="note.text"
                        @on-update="(data) => updateNote(data, note)"
                        v-if="noteToUpdate === note.date"
                    />
                    <div v-else v-html="note.text"/>
                </div>
            </div>
            <div class="border p-2 w-32" v-if="showActions(note)">
                <div class="flex justify-center">
                    <el-tooltip :content="$t('Display note on the list')" :open-delay="openDelay" class="item"
                                effect="dark"
                                placement="top">
                        <eye-off-icon @click="displayNoteInList(true, note)"
                                      class="text-primary w-4 cursor-pointer"
                                      v-if="!note.displayed"></eye-off-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Hide note from list')" :open-delay="openDelay" class="item"
                                effect="dark" placement="top">
                        <eye-icon @click="displayNoteInList(false, note)"
                                  class="text-primary w-4 cursor-pointer"
                                  v-if="note.displayed"></eye-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Open edit mode for this note')" :open-delay="openDelay"
                                class="item" effect="dark"
                                placement="top">
                        <edit-3-icon @click="onEditNote(note)" class="text-green w-4 mx-2 cursor-pointer"
                                     cursor-pointer></edit-3-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Remove note')" :open-delay="openDelay" class="item" effect="dark"
                                placement="top">
                        <trash-2-icon @click="removeNote(note)"
                                      class="text-red w-4 cursor-pointer"></trash-2-icon>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Modal from '@/components/Common/Modal'
    import get from 'lodash/get'
    import format from 'date-fns/format'
    import { Tooltip } from 'element-ui'
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import { Edit3Icon, EyeIcon, EyeOffIcon, Trash2Icon } from 'vue-feather-icons'

    export default {
        components: {
            [Tooltip.name]: Tooltip,
            EyeOffIcon,
            Trash2Icon,
            Edit3Icon,
            HtmlEditor,
            EyeIcon,
            Modal,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false,
            },
            onEditMode: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                creationMode: false,
                editMode: false,
                noteToUpdate: null,
                openDelay: 400,
                dialogWidth: '90%',
            }
        },
        computed: {
            fetchNotes() {
                let allNotes = get(this.data.WidgetLayout, 'Notes', [])
                if (this.editMode) {
                    return allNotes
                }
                return allNotes.filter((note) => note.displayed)
            },
            margins() {
                if (this.$rtl.isRTL) {
                    return this.editable ? 'ml-24' : 'ml-12'
                } else {
                    return this.editable ? 'mr-24' : 'mr-12'
                }
            },
        },
        methods: {
            getFormattedDate(date) {
                return format(date, 'yy-MM-dd HH:mm')
            },
            onAddNote() {
                this.creationMode = !this.creationMode
            },
            onEditNote(note) {
                this.noteToUpdate = note.date
            },
            addNote(val) {
                this.creationMode = false
                if (val) {
                    let note = this.newNoteObject()
                    note.text = val

                    this.data.WidgetLayout['Notes'].push(note)
                    this.emmitUpdate()
                }
            },
            removeNote(note) {
                this.$confirm(
                    this.$t('common.confirm.question', {
                        action: this.$t('to remove this note'),
                    }), this.$t('Remove note'), {
                        cancelButtonText: this.$t('common.cancel'),
                        confirmButtonText: this.$t('common.confirm'),
                    }).then(() => {
                    let noteIndex = this.getNoteIndex(note)
                    this.data.WidgetLayout['Notes'].splice(noteIndex, 1)
                    this.emmitUpdate()
                })
            },
            displayNoteInList(state, note) {
                note.displayed = state
                this.fetchAndUpdate(note)
            },
            updateNote(text, note) {
                note.text = text
                this.fetchAndUpdate(note)
            },
            fetchAndUpdate(note) {
                let noteIndex = this.getNoteIndex(note)
                this.data.WidgetLayout['Notes'][noteIndex] = note
                this.emmitUpdate()
            },
            newNoteObject() {
                return {
                    date: new Date().getTime(),
                    text: '',
                    displayed: true,
                }
            },
            getNoteIndex(note) {
                return this.data.WidgetLayout['Notes'].findIndex((el) => el.date === note.date)
            },
            emmitUpdate() {
                this.data.WidgetLayout['editMode'] = this.editMode
                this.$emit('on-update', this.data)
                this.noteToUpdate = null
            },
            showActions(note) {
                return this.editMode && (!this.noteToUpdate || this.noteToUpdate !== note.date)
            },
        },
        mounted() {
            if (!this.data.WidgetLayout['Notes']) {
                this.data.WidgetLayout['Notes'] = []
            }

            if (!this.data.WidgetLayout.hasOwnProperty('displayWidgetTitle')) {
                this.$set(this.data.WidgetLayout, 'displayWidgetTitle', false)
            }
        },
        watch: {
            onEditMode: {
                immediate: true,
                handler(state) {
                    this.editMode = state
                },
            },
        },
    }
</script>
