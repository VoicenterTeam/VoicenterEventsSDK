<template>
    <div class="player-wrapper">
        <vue-audio :file="url"/>
    </div>
</template>

<script>
    import WidgetErrorBoundary from "@/components/WidgetErrorBoundary";
    import VueAudio from 'vue-audio/src/VueAudio';

    export default {
        name: "audio-player",
        components: {
            VueAudio,
            WidgetErrorBoundary,
        },
        props: {
            url: {
                type: String,
                default: ''
            }
        },
        errorCaptured(err, vm, info) {
            console.warn(err, vm, info)
            return false
        },
    }
</script>

<style lang="scss">
    .player-wrapper {
        margin: 5px;
    }
    .vue-sound-wrapper {
        [class^="icon-"], [class*=" icon-"] {
            display: inline-block;
            font: normal normal normal 1em/1 'Nucleo';
            vertical-align: middle;
            speak: none;
            text-transform: none;
            /* Better Font Rendering */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            padding: 0;

        }

        .vue-sound__extern-wrapper {
            display: flex !important;
        }

        .vue-sound__player {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }


        input.volume-slider {
            position: relative !important;
            left: 5px !important;
            top: 6px !important;
            right: 5px !important;
        }

        .vue-sound__playback-time-wrapper {
            height: 5px !important;
        }

        .icon-spinner11 {
            display: none !important;
        }

        .icon-download:before {
            content: url('data:image/svg+xml; utf8, <svg data-v-fb1278fc="" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-download"><path data-v-fb1278fc="" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline data-v-fb1278fc="" points="7 10 12 15 17 10"></polyline><line data-v-fb1278fc="" x1="12" y1="15" x2="12" y2="3"></line></svg>');
            font-weight: 900;
        }

        .icon-download {
            margin-right: 10px;
        }

        .icon-play3:before {
            content: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-play"><polygon data-v-fb1278fc="" points="5 3 19 12 5 21 5 3"></polygon></svg>');
            font-weight: 900;
        }

        .icon-pause2:before {
            content: url('data:image/svg+xml; utf8, <svg data-v-fb1278fc="" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-pause"><rect data-v-fb1278fc="" x="6" y="4" width="4" height="16"></rect><rect data-v-fb1278fc="" x="14" y="4" width="4" height="16"></rect></svg>');
            font-weight: 900;
        }
        .icon-stop2:before {
            content: url('data:image/svg+xml; utf8, <svg data-v-fb1278fc="" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-stop-circle"><circle data-v-fb1278fc="" cx="12" cy="12" r="10"></circle><rect data-v-fb1278fc="" x="9" y="9" width="6" height="6"></rect></svg>');
            font-weight: 900;
        }

        .icon-volume-high:before {
            content: url('data:image/svg+xml; utf8, <svg data-v-fb1278fc="" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-volume-2"><polygon data-v-fb1278fc="" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path data-v-fb1278fc="" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>');
            font-weight: 900;
        }

        .icon-volume-mute2:before {
            content: url('data:image/svg+xml; utf8, <svg data-v-fb1278fc="" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg feather feather-volume-x"><polygon data-v-fb1278fc="" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line data-v-fb1278fc="" x1="23" y1="9" x2="17" y2="15"></line><line data-v-fb1278fc="" x1="17" y1="9" x2="23" y2="15"></line></svg>');
            font-weight: 900;
        }
        .icon-volume-high,
        .icon-volume-mute2 {
            margin-top: 5px;
            margin-left: 0px;
        }
        .icon-download {
            margin-top: 3px;
        }
        .icon-stop2:before,
        .icon-stop2 {
            display: none !important;
        }
    }
</style>
