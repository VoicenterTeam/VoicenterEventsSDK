<template>
    <component
        :is="componentType"
        v-bind="$attrs"
        v-on="hooks"
        :enter-active-class="enterClass"
        move-class="slide-move"
        :leave-active-class="leaveClass"
    >
        <slot></slot>
    </component>
</template>

<script>
    import {baseTransition} from 'vue2-transitions/src/mixins/index'

    export default {
        name: 'wizard-transition',
        mixins: [baseTransition],
        props: {
            direction: {
                type: String,
                default: 'right',
                validator(value) {
                    const acceptedValues = ['', 'left', 'right'];

                    return acceptedValues.indexOf(value) !== -1;
                },
            }
        },
        computed: {
            enterClass() {
                return this.direction === 'left' ? 'slideXRightIn' : 'slideXLeftIn'
            },
            leaveClass() {
                return this.direction === 'left' ? 'slideXRightOut' : 'slideXLeftOut'
            },
        }
    }
</script>

<style lang="scss">
    .slide-move {
        transition: transform .2s;
    }

    @keyframes slideXLeftIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }

        to {
            opacity: 1;
        }
    }

    .slideXLeftIn {
        animation-name: slideXLeftIn;
    }

    @keyframes slideXLeftOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }

    .slideXLeftOut {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        animation-name: slideXLeftOut;
    }

    @keyframes slideXRightIn {
        from {
            opacity: 0;
            transform: translateX(-100%);
        }

        to {
            opacity: 1;
        }
    }

    .slideXRightIn {
        animation-name: slideXRightIn;
    }

    @keyframes slideXRightOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    .slideXRightOut {
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        animation-name: slideXRightOut;
    }
</style>
