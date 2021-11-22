<template>
    <div class="flex min-h-20 max-h-40"
         :class="{'is-active': isActive}">
        <i class="has-transition">
            <component :is="icon"
                       class="w-5 h-5 text-gray-550 -mt-1"/>
        </i>
        <div class="wizard-step">
            <div class="flex flex-col justify-center items-center h-full relative">
                <IconEllipse class="w-4 h-4 text-gray-550 mx-6"/>
                <fade-transition :duration="transitionDuration" mode="out-in">
                    <div v-if="isActive"
                         class="progress-circle-outer flex items-center -mt-2 justify-center bg-primary-100 absolute top-0"/>
                </fade-transition>
                <div class="flex flex-col top-0 justify-around h-full w-1 progress-line"
                     :class="isLast ? 'bg-transparent' : 'bg-gray-550'">
                    <IconArrowSimpleDown v-for="i in 3"
                                         :key="i"
                                         class="text-white"/>
                </div>

            </div>
        </div>
        <div class="flex flex-col leading-5 flex-1">
            <span class="font-bold text-base -mt-1 uppercase leading-5"
                  :class="{'text-primary': isActive}">
                {{ index }}. {{ $t(name) }}
            </span>
            <div class="font-medium text-sm max-h-28 overflow-auto my-3">
                <p v-html="summary"/>
            </div>
        </div>
        <i v-if="canEdit"
           class="cursor-pointer text-gray-550 hover:text-primary"
           @click="onEditStep">
            <IconPencil class="w-4 h-4"/>
        </i>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        props: {
            icon: {
                type: String,
                default: 'IconWidgetName',
            },
            name: {
                type: String,
                default: 'Widget Selection',
            },
            isActive: {
                type: Boolean,
                default: false,
            },
            isLast: {
                type: Boolean,
                default: false,
            },
            canEdit: {
                type: Boolean,
                default: false,
            },
            index: Number,
            summary: String,
        },
        data() {
            return {
                transitionDuration: 300,
            }
        },
        methods: {
            onEditStep() {
                this.$emit('on-edit-step')
            }
        }
    }
</script>
<style lang="scss" scoped>
.wizard-step {
    @apply flex items-center;
    .progress-circle-outer {
        @apply rounded-full w-7 h-7;
        border: solid 1px var(--primary-color);
    }
}


svg {
    path {
        transition: fill 0.3s ease-out;
    }
}

.is-active {
    transition: all 0.3s ease-out;

    .progress-line {
        transition: all 0.3s ease-out;
        @apply bg-primary;
    }


    svg {
        path, circle {
            transition: stroke 0.3s ease-out;
            stroke: var(--primary-color);
        }
    }
}
</style>
