<template>
    <div class="content-wrapper leading-5 text-sm font-normal text-gray-950">
        <div class="flex justify-between mb-8">
            <div class="flex">
                <div class="flex flex-col w-38"
                     :class="$rtl.isRTL ? 'ml-10' : 'mr-10'">
                    <span class="mb-2">
                        {{ $t('report.frequency') }}:
                    </span>
                    <base-select :value="selectedFrequency.value"
                                 id="frequency"
                                 key="frequency"
                                 size="small"
                                 :multiple="false"
                                 :filterable="false"
                                 :options="frequencyOptions"
                                 @change="onChangeFrequency">
                        <template v-slot:prefix>
                            <component class="text-primary w-4 h-4 mt-1-5"
                                       :class="$rtl.isRTL ? 'mr-1' : 'ml-1'"
                                       :is="selectedFrequency.icon"/>
                        </template>
                    </base-select>
                </div>
                <div class="transition flex">
                    <template v-if="selectedFrequency.value === DAILY_FREQUENCY">
                        <div class="flex transition">
                            <div v-for="day in daysAbbr"
                                 :key="day"
                                 @click="onChoseDay(day)"
                                 class="transition mt-6-6 text-sm mx-1 font-normal cursor-pointer rounded-full w-8 h-8 border border-gray-550 text-gray-550 items-center justify-center flex select-none"
                                 :class="{'active': model.selectedDays.includes(day)}">
                                {{ day }}
                            </div>
                            <div class="flex flex-col"
                                 :class="$rtl.isRTL ? 'mr-10' : 'ml-10'">
                                <span class="mb-2">
                                    {{ $t('widget.time') }}:
                                </span>
                                <TimePicker id="time"
                                            class="flex w-35"
                                            size="small"
                                            v-model="model.time"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-if="selectedFrequency.value === MONTHLY_FREQUENCY">
                        <div class="flex flex-col">
                            <span class="mb-2">
                                {{ $t('Day') }}:
                            </span>
                            <base-date-picker id="day"
                                              class="flex"
                                              size="small"
                                              v-model="model.day"
                            />
                        </div>
                        <div class="flex flex-col"
                             :class="$rtl.isRTL ? 'mr-10' : 'ml-10'">
                            <span class="mb-2">
                                {{ $t('widget.time') }}:
                            </span>
                            <TimePicker id="_time"
                                        class="flex w-35"
                                        size="small"
                                        v-model="model.time"
                            />
                        </div>
                    </template>
                    <template v-if="selectedFrequency.value === INTERVAL_FREQUENCY">
                        <div class="flex">
                            <div v-for="day in daysAbbr"
                                 :key="`interval-${day}`"
                                 @click="onChoseDay(day)"
                                 class="transition mt-6-6 text-sm mx-1 font-normal cursor-pointer rounded-full w-8 h-8 border border-gray-550 text-gray-550 items-center justify-center flex select-none"
                                 :class="{'active': model.selectedDays.includes(day)}">
                                {{ day }}
                            </div>
                            <div class="flex flex-col mx-5 3xl:mx-10">
                                <span class="mb-2">
                                    {{ $t('widget.timeRange') }}:
                                </span>
                                <TimeRange id="time_range"
                                           class="flex w-38"
                                           size="small"
                                           v-model="model.time_range"
                                />
                            </div>
                            <div class="flex flex-col">
                                <span class="mb-2">
                                    {{ $t('widget.interval') }}:
                                </span>
                                <TimePicker id="interval"
                                            class="flex w-35"
                                            size="small"
                                            v-model="model.interval"
                                />
                            </div>
                            <div class="flex flex-col"
                                 :class="$rtl.isRTL ? 'mr-5 3xl:mr-10' : 'ml:5 3xl:ml-10'">
                                <span class="mb-2">
                                    {{ $t('report.checkEvery') }}:
                                </span>
                                <TimePicker id="check_every"
                                            class="flex w-35"
                                            size="small"
                                            v-model="model.check_every"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <Conditions/>
        <portal to="next-button">
            <base-button fixed-width="w-37"
                         @click="goNext">
                <div class="flex items-center">
                    <span class="mx-1 text-base font-bold">
                        {{ $t('general.next') }}
                    </span>
                    <IconDirRight class="mx-1"/>
                </div>
            </base-button>
        </portal>
    </div>
</template>
<script>
    import TimeRange from '@/modules/reports/components/TimeRange'
    import TimePicker from '@/modules/reports/components/TimePicker'
    import BaseDatePicker from '@/components/Widgets/BaseDatePicker'
    import Conditions from '@/modules/reports/components/schedule/components/Conditions'
    
    const DAILY_FREQUENCY = 'daily'
    const MONTHLY_FREQUENCY = 'monthly'
    const INTERVAL_FREQUENCY = 'interval'
    
    export default {
        components: {
            TimeRange,
            TimePicker,
            Conditions,
            BaseDatePicker,
        },
        data() {
            return {
                DAILY_FREQUENCY,
                MONTHLY_FREQUENCY,
                INTERVAL_FREQUENCY,
                daysAbbr: [
                    'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa',
                ],
                frequencyOptions: [
                    {
                        label: 'Daily',
                        value: DAILY_FREQUENCY,
                        icon: 'IconDaily',
                    },
                    {
                        label: 'Monthly',
                        value: MONTHLY_FREQUENCY,
                        icon: 'IconCalendar',
                    },
                    {
                        label: 'Interval',
                        value: INTERVAL_FREQUENCY,
                        icon: 'IconInterval',
                    },
                ],
                showMenu: false,
                selectedFrequency: {
                    label: 'Interval',
                    value: INTERVAL_FREQUENCY,
                    icon: 'IconInterval',
                },
                model: {
                    selectedDays: ['Su', 'Tu', 'We'],
                    time: '00:00',
                    time_range: '',
                    interval: '',
                    check_every: '',
                },
            }
        },
        computed: {
            reportToEdit() {
                return this.$store.getters['report/getReportData']
            },
        },
        methods: {
            onMenuClickOutside() {
                this.showMenu = false
            },
            triggerMenu() {
                this.showMenu = !this.showMenu
            },
            onChoseDay(day) {
                const index = this.model.selectedDays.findIndex(el => el === day)
                if (index === -1) {
                    this.model.selectedDays.push(day)
                    return
                }
                this.model.selectedDays.splice(index, 1)
            },
            onChangeFrequency(frq) {
                const frequencyObj = this.frequencyOptions.find(frequency => frequency.value === frq)
                this.selectedFrequency = { ...frequencyObj }
            },
            goNext() {
                const objToEmit = {
                    summary: '',
                    nextStep: true,
                }
                this.$emit('on-update', objToEmit)
            },
        },
    }
</script>
<style lang="scss" scoped>
.menu-wrapper {
    @apply z-50 rounded bg-white mt-12 absolute w-40 flex flex-col origin-top-right right-0 shadow-base;
}

.is-expanded {
    transform: rotate(-180deg);
}

.transition {
    transition: all 0.3s ease-out;
}

.active {
    @apply bg-primary text-white border-primary;
}
</style>
<style lang="scss">
.el-time-range-picker {
    .el-time-panel__footer {
        height: 40px !important;
        
        .el-time-panel__btn.confirm {
            color: white !important;
            background: var(--primary-color) !important;
            border: 1px solid var(--primary-color) !important;
            border-radius: 4px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            
            &:hover {
                opacity: 0.75 !important;
            }
        }
        
        .el-time-panel__btn.cancel {
            border: 2px solid var(--gray-550) !important;
            border-radius: 4px !important;
            padding-left: 16px !important;
            font-weight: 700 !important;
            color: var(--gray-550) !important;
            padding-right: 16px !important;
            
            &:hover {
                background: var(--gray-200) !important;
            }
        }
    }
}
</style>
