<template>
    <div class="step-3">
        <div class="flex justify-between">
            <div class="flex items-center">
                <div class="flex relative w-40 rounded h-9 border "
                     :class="[$rtl.isRTL ? 'mr-auto ml-6': 'mr-6 ml-auto',showMenu ? 'border border-primary': 'border-gray-550']">
                    <button @click.stop="triggerMenu"
                            class="flex w-full items-center rounded cursor-pointer focus:outline-none justify-between px-4">
                        <div class="text-main-sm md:text-main-lg text-gray-500 w-40 truncate flex items-center">
                            <span class="mx-2 capitalize">{{ value }}</span>
                        </div>
                        <div class="flex">
                            <IconArrowDown class="text-gray-500 transition"
                                           :class="{'is-expanded text-primary': showMenu}"/>
                        </div>
                    </button>
                    <fade-transition :duration="350">
                        <div v-click-outside="onMenuClickOutside"
                             class="menu-wrapper"
                             v-if="showMenu">
                            <div @click="onChangeLimit(option)"
                                 class="flex flex-row items-center justify-between py-3 px-1 mx-4 cursor-pointer border-t"
                                 v-for="option in options">
                                <div class="flex-1 hover:text-primary"
                                     :class="{'text-primary': +option === +value}">
                                    {{ option }}
                                </div>
                            </div>
                        </div>
                    </fade-transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        props: {
            value: {
                type: Number,
                default: 5,
            },
            options: {
                type: Array,
                default: () => [5, 10, 25, 50, 100],
            },
        },
        data() {
            return {
                showMenu: false,
            }
        },
        methods: {
            onMenuClickOutside() {
                this.showMenu = false
            },
            onChangeLimit(prePage) {
                this.$emit('input', prePage)
                this.onMenuClickOutside()
            },
            triggerMenu() {
                this.showMenu = !this.showMenu
            },
        },
    }
</script>
<style lang="scss" scoped>
.menu-wrapper {
    @apply z-50 rounded bg-white mt-10 absolute w-40 flex flex-col origin-top-right right-0 shadow-base;
}

.is-expanded {
    transform: rotate(-180deg);
}

.transition {
    transition: all 0.3s ease-out;
}

.active {
    @apply bg-primary text-white;
}
</style>
