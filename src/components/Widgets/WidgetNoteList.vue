<template>
    <div>
        <data-table
            :border="border"
            :columns="availableColumns"
            :editable="editable"
            :manageColumns="false"
            :showColumns="visibleColumns"
            :stripe="stripe"
            :tableData="fetchNotes"
            :widgetTitle="data.Title">
            <template v-slot:title>
                <base-widget-title :title="data.Title"/>
            </template>
            <template v-slot:date="{row, index}">
                {{getFormattedDate(row.date)}}
            </template>
            <template v-slot:text="{row, index}">
                <div class="text-main-sm  flex justify-left">
                    <html-editor
                        :value="row.text"
                        @on-update="(data) => updateNote(data, row)"
                        v-if="noteToUpdate === row.date">
                    </html-editor>
                    <div v-else v-html="row.text"></div>
                </div>
            </template>
            <template v-slot:actions="{row, index}">
                <div class="flex justify-center">
                    <el-tooltip :content="$t('Display note on the list')" :open-delay="openDelay" class="item"
                                effect="dark"
                                placement="top">
                        <eye-icon @click="displayNoteInList(true, row)"
                                  class="text-primary w-4 cursor-pointer"
                                  v-if="!row.displayed"></eye-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Hide note from list')" :open-delay="openDelay" class="item"
                                effect="dark" placement="top">
                        <eye-off-icon @click="displayNoteInList(false, row)"
                                      class="text-primary w-4 cursor-pointer"
                                      v-if="row.displayed"></eye-off-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Open edit mode for this note')" :open-delay="openDelay"
                                class="item" effect="dark"
                                placement="top">
                        <edit-3-icon @click="onEditNote(row)" class="text-green w-4 mx-2 cursor-pointer"
                                     cursor-pointer></edit-3-icon>
                    </el-tooltip>
                    <el-tooltip :content="$t('Remove note')" :open-delay="openDelay" class="item" effect="dark"
                                placement="top">
                        <trash-2-icon @click="removeNote(row)"
                                      class="text-red w-4 cursor-pointer"></trash-2-icon>
                    </el-tooltip>
                </div>
            </template>
            <template v-slot:additional-data>
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full py-0-5">
                    <div class="flex items-center" v-if="!creationMode">
                        <el-tooltip :content="$t('Display hidden notes')" :open-delay="openDelay" class="item"
                                    effect="dark"
                                    placement="top">
                            <el-switch class="mx-2" v-model="displayAllNotes"/>
                        </el-tooltip>
                        <el-tooltip :content="$t('Add New Note')" :open-delay="openDelay" class="item" effect="dark"
                                    placement="top">
                            <AddButton @click="onAddNote"/>
                        </el-tooltip>
                    </div>
                </div>
            </template>
            <template v-slot:container-above>
                <div class="w-full py-2" v-if="creationMode">
                    <html-editor
                        @on-update="addNote"/>
                </div>
            </template>
        </data-table>
    </div>
</template>
<script>
    import get from 'lodash/get'
    import format from 'date-fns/format'
    import {Switch, Tooltip} from 'element-ui'
    import DataTable from "@/components/Table/DataTable";
    import AddButton from '@/components/AddButton'
    import HtmlEditor from '@/components/Html/HtmlEditor'
    import {Edit3Icon, EyeIcon, EyeOffIcon, Trash2Icon} from 'vue-feather-icons'

    export default {
        components: {
            [Tooltip.name]: Tooltip,
            [Switch.name]: Switch,
            EyeOffIcon,
            Trash2Icon,
            Edit3Icon,
            AddButton,
            HtmlEditor,
            EyeIcon,
            DataTable,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                creationMode: false,
                displayAllNotes: false,
                noteToUpdate: null,
                openDelay: 400,
                border: true,
                stripe: true,
                manageColumns: false,
                availableColumns: [
                    {
                        prop: 'date',
                        fixed: false,
                        align: 'center',
                        label: this.$t('Date'),
                        width: 180,
                    },
                    {
                        prop: 'text',
                        fixed: false,
                        align: 'center',
                        label: this.$t('Text'),
                    },
                    {
                        prop: 'actions',
                        fixed: false,
                        align: 'center',
                        label: this.$t('Actions'),
                        width: 150,
                    },
                ],
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
            visibleColumns () {
                return this.availableColumns.map(c => c.prop)
            }
        },
        methods: {
            getFormattedDate(date) {
                return format(date, 'yy-MM-dd H:m:s')
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
