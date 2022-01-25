<template>
    <component
        :is="tag"
        :type="tag === 'button' ? nativeType : ''"
        :disabled="disabled || loading"
        :name="name"
        :data-test="`button-${dataTestName}`"
        class="btn truncate flex justify-center items-center focus:outline-none focus:shadow-none active:outline-none active:shadow-none select-none"
        :class="{
            'rounded': !round,
            'rounded-full': round,
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
            'py-1 min-h-6': size === 'xxs',
            'py-1.5 min-h-6': size === 'xs',
            'py-1 min-h-10 md:min-h-6': size === 'sm',
            'py-1 min-h-8': size === 'sml',
            'py-1 min-h-12 md:py-2 md:min-h-10': size === 'md',

            'border': outline && ['xs', 'sm', 'sml'].includes(size),
            'border-2': outline && size === 'md',

            'text-destructive-actions bg-transparent': type === 'danger' && link,
            'text-white bg-destructive-actions': type === 'danger' && !outline && !link,
            'text-destructive-actions bg-transparent border-destructive-actions': type === 'danger' && outline,
            'hover:bg-destructive-actions--focus focus:bg-destructive-actions--pressed active:bg-destructive-actions--pressed': type === 'danger' && !outline && !link  && !disabled && !noStates,
            'hover:bg-destructive-actions-bg--focus focus:bg-destructive-actions-bg--pressed active:bg-destructive-actions-bg--pressed hover:text-destructive-actions--focus focus:text-destructive-actions--pressed active:text-destructive-actions--pressed' : type === 'danger' && (link || outline)  && !disabled && !noStates,

            'text-primary-actions bg-transparent': type === 'primary' && link && !forHeaders && !isElement,
            'text-headers bg-transparent': type === 'primary' && link && forHeaders && !isElement,
            'text-white bg-primary-actions': type === 'primary' && !outline && !link && !isElement,
            'text-primary-actions bg-transparent border-primary-actions': type === 'primary' && outline && !forHeaders && !isElement,
            'text-headers bg-transparent border-primary-actions': type === 'primary' && outline && forHeaders && !isElement,
            'hover:bg-primary-actions--focus focus:bg-primary-actions--pressed active:bg-primary-actions--pressed': type === 'primary' && !outline && !link  && !disabled && !noStates && !isElement,
            'hover:bg-primary-actions-bg--focus focus:bg-primary-actions-bg--pressed active:bg-primary-actions-bg--pressed hover:text-primary-actions--focus focus:text-primary-actions--pressed active:text-primary-actions--pressed' : type === 'primary' && (link || outline)  && !disabled && !noStates && !isElement,

            'text-active-elements bg-transparent': type === 'primary' && link && !forHeaders && isElement,
            'text-headers bg-transparent': type === 'primary' && link && forHeaders && isElement,
            'text-white bg-active-elements': type === 'primary' && !outline && !link && isElement,
            'text-active-elements bg-transparent border-active-elements': type === 'primary' && outline && !forHeaders && isElement,
            'text-headers bg-transparent border-active-elements': type === 'primary' && outline && forHeaders && isElement,
            'hover:bg-active-elements--focus focus:bg-active-elements--pressed active:bg-active-elements--pressed': type === 'primary' && !outline && !link  && !disabled && !noStates && isElement,
            'hover:bg-active-elements-bg--focus focus:bg-active-elements-bg--pressed active:bg-active-elements-bg--pressed hover:text-active-elements--focus focus:text-active-elements--pressed active:text-active-elements--pressed' : type === 'primary' && (link || outline)  && !disabled && !noStates && isElement,

            'text-secondary-actions bg-transparent': type === 'default' && link,
            'text-white bg-secondary-actions': type === 'default' && !outline && !link,
            'text-secondary-actions bg-transparent border-secondary-actions': type === 'default' && outline,
            'hover:bg-secondary-actions--focus focus:bg-secondary-actions--pressed active:bg-secondary-actions--pressed': type === 'default' && !outline && !link  && !disabled && !noStates,
            'hover:bg-secondary-actions-bg--focus focus:bg-secondary-actions-bg--pressed active:bg-secondary-actions-bg--pressed hover:text-secondary-actions--focus focus:text-secondary-actions--pressed active:text-secondary-actions--pressed' : type === 'default' && (link || outline)  && !disabled && !noStates,

            'text-sm font-normal': ['xs', 'sm', 'sml'].includes(size),
            'text-base font-bold': size === 'md',

            'leading-tight': ['xs', 'sm', 'sml', 'md'].includes(size),

            'px-2': ['xs', 'sm', 'sml', 'md'].includes(size) && square || (size === 'xs') && !square,
            'px-3': size === 'md' && shortWidth && !square,
            'px-4': ['sm', 'sml'].includes(size) && !square,
            'px-2 sm:px-8': size === 'md' && !shortWidth && !square,

            'w-4': size === 'xs' && square,
            'w-6': size === 'sm' && square,
            'w-8': size === 'sml' && square,
            'w-10': size === 'md' && square,
            'min-w-100p': (size === 'sm' || size === 'sml' || size === 'md' && shortWidth) && !square && width !== 'auto',
            'min-w-140p': size === 'md' && !shortWidth && !square && width !== 'auto',

            'animation' : animation,
            'rotate' : animation === 'rotate',
        }"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-if="$slots.icon || icon">
            <slot name="icon">
                <i v-if="!loading"
                   :class="[{
                         'mx-1' : size === 'xs',
                         'min-w-4.5': size === 'sml',
                         'icon-md' : iconSize === 'md',
                         'icon-sm' : iconSize === 'sm',
                         'icon-lg' : iconSize === 'lg',
                         'text-white ': !outline ,
                         'mr-1': !square && size === 'sm',
                         'mr-2 button-icon': !square && (size === 'md' || size === 'sml'),
                         'destructive text-destructive-actions': type === 'danger' && (outline || link),
                         'primary text-primary-actions': type === 'primary' && (outline || link) && !isElement,
                         'active text-active-elements': type === 'primary' && (outline || link) && isElement,
                         'secondary text-secondary-actions': type === 'default' && (outline || link),
                    }, icon, iconClasses]"
                   class="button-icon icon"
                />
            </slot>
        </template>
        <slot name="loading">
            <i v-if="loading" class="mx-2.5 vc-load icon-md fa-spin sml"/>
        </slot>
        <slot v-if="!square"/>
    </component>
</template>
<script>
export default {
    name: 'base-button',
    props: {
        tag: {
            type: String,
            default: 'button',
            description: 'Button html tag'
        },
        nativeType: {
            type: String,
            default: 'button',
            description: 'Button native type (e.g button, input etc)'
        },
        round: Boolean,
        loading: Boolean,
        disabled: Boolean,
        outline: Boolean,
        type: {
            type: String,
            default: 'default',
            description: 'Button type (primary|danger|default)'
        },
        icon: {
            type: String,
            default: '',
        },
        iconSize: {
            type: String,
            default: '',
            description: 'Button icon size (sm|md|lg)'
        },
        iconClasses: {
            type: String,
            default: '',
            description: 'Additional classes for icon'
        },
        width: {
            type: String,
            default: '',
            description: 'Button width (auto)'
        },
        shortWidth: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'md',
            description: 'Button size (sm|sml|md|lg)'
        },
        link: {
            type: Boolean,
            description: 'Whether button is a link (no borders or background)'
        },
        square: {
            type: Boolean,
            default: false,
            description: '(whether button is perfect square)'
        },
        animation: {
            type: String,
            default: '',
            description: 'Button animation (rotate)'
        },
        noStates: {
            type: Boolean,
            default: false,
            description: 'Disable hover, focus and active states'
        },
        name: {
            type: String,
            default: '',
            description: 'Button name'
        },
        dataTestName: {
            type: String,
            default: 'default'
        },
        forHeaders: {
            type: Boolean,
            default: false
        },
        isElement: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss" scoped>
.btn {
    @apply transition duration-300 ease-in-out;
    line-height: normal;


    &:hover {
        .icon {
            .destructive {
                @apply text-destructive-actions--focus;
            }
            .primary {
                @apply text-primary-actions--focus;
            }
            .active {
                @apply text-active-elements--focus;
            }
            .secondary {
                @apply text-secondary-actions--focus;
            }
        }
    }
    &:focus,
    &:active {
        .icon {
            .destructive {
                @apply text-destructive-actions--pressed;
            }
            .primary {
                @apply text-primary-actions--pressed;
            }
            .active {
                @apply text-active-elements--pressed;
            }
            .secondary {
                @apply text-secondary-actions--pressed;
            }
        }
    }
}

button:disabled {
    @apply opacity-50;
}

.button-icon {
    @apply text-base;

    &.icon-sm {
        font-size: 0.875rem;
    }
    &.icon-md {
        font-size: 1.125rem;
    }
    &.icon-lg {
        font-size: 1.375rem;
    }
}

.rtl .button-icon{
    @apply mr-0 ml-2;
}
</style>
