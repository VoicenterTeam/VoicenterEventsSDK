<template>
    <div class="note-list-editor">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-0-5">
            <div class="flex">
                <base-widget-title :title="data.Title"/>
            </div>
            <div :class="getClass" class="flex items-center" v-if="!creationMode">
                <el-tooltip :content="$t('Display hidden notes')" class="item" effect="dark" placement="top">
                    <el-switch class="mx-2" v-model="displayAllNotes"/>
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
            <div @click="onEditNote(note)" class="note-container" v-for="(note, index) in fetchNotes">
                <div :key="index" class="flex flex-col p-3" :class="$rtl.isRTL ? 'right-border' : 'left-border'">
                    <div class="pb-2 flex flex-row justify-between">
                        <div class="flex items-center-mx-1">
                            <IconFace class="mx-1"/>
                            <div class="flex items-center" v-html="getCreationDetails(note)"/>
                        </div>
                        <div @click.prevent.stop class="actions cursor-pointer flex">
                            <el-tooltip :content="$t('Display note on the list')" class="item" effect="dark"
                                        placement="top">
                                <eye-icon @click="displayNoteInList(true, note)"
                                          class="text-primary w-4 mx-2 cursor-pointer"
                                          v-if="!note.displayed"></eye-icon>
                            </el-tooltip>
                            <el-tooltip :content="$t('Hide note from list')" class="item" effect="dark" placement="top">
                                <eye-off-icon @click="displayNoteInList(false, note)"
                                              class="text-primary w-4 mx-2 cursor-pointer"
                                              v-if="note.displayed"></eye-off-icon>
                            </el-tooltip>
                            <el-tooltip :content="$t('Open edit mode for this note')" class="item" effect="dark"
                                        placement="top">
                                <edit-3-icon @click="onEditNote(note)" class="text-green w-4 mx-2"></edit-3-icon>
                            </el-tooltip>
                            <el-tooltip :content="$t('Remove note')" class="item" effect="dark"
                                        placement="top">
                                <trash-2-icon @click="removeNote(note)" class="text-red w-4"></trash-2-icon>
                            </el-tooltip>
                        </div>
                    </div>
                    <div @click.prevent.stop class="text-main-sm">
                        <html-editor
                            :value="note.text"
                            @on-update="(data) => updateNote(data, note)"
                            v-if="noteToUpdate === note.date">
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
    import AddButton from '@/components/AddButton'
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import formatDistance from 'date-fns/formatDistance'
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
        },
        data () {
            return {
                creationMode: false,
                displayAllNotes: false,
                noteToUpdate: null,
            }
        },
        computed: {
            fetchNotes () {
                let allNotes = get(this.data.WidgetLayout, 'Notes', [])
                if (this.displayAllNotes) {
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
            currentAccount () {
                return this.$store.getters['entities/getCurrentAccount']
            },
        },
        methods: {
            getCreationDetails (note) {
                let userName = get(note.user, 'name', this.$t('A user'))
                let time = this.timeAgo(note.date)
                return `<p class="">${userName}<span class="mx-2 text-main-sm text-grey-400 opacity-50">${this.$t('added a note', {time: time})}</span></p>`
            },
            timeAgo(time) {
                return formatDistance(
                    time,
                    new Date().getTime(),
                )
            },
            onAddNote () {
                this.creationMode = !this.creationMode
            },
            onEditNote (note) {
                this.noteToUpdate = note.date
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
                    user: this.currentAccount
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
            @apply border-b-2 cursor-pointer;
            .right-border:hover{
                @apply border-primary border-r-4;
            }
            .left-border:hover{
                @apply border-primary border-l-4;
            }
        }
    }
</style>
