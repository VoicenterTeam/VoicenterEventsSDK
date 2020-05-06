<template>
    <div class="flex flex-col justify-center">
        <template v-if="extension.calls.length">
            <call-info
                :call="call"
                :hideCallInfo="hideCallInfo"
                :hideCallerInfo="hideCallerInfo"
                :key="call.ivrid"
                :settings="settings"
                :text-color="'text-white'"
                v-for="(call, index) in extension.calls"
            >
                <template v-slot:threshold="{statusThreshold}">
                    <component :is="statusThreshold.icon" class="w-6 mb-1 mx-2" v-if="statusThreshold.show"/>
                </template>
            </call-info>
        </template>
        <div v-else>
            {{$t('No callers')}}
        </div>
    </div>
</template>
<script>
    import CallInfo from '@/components/Cards/CallInfo'

    export default {
        components: {
            CallInfo
        },
        props: {
            extension: {
                type: Object,
                default: () => ({})
            },
            settings: {
                type: Object,
                default: () => ({})
            },
            hideCallerInfo: {
                type: Boolean,
                default: false,
            },
            hideCallInfo: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>
