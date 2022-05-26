export default {
    computed: {
        getCardStyles () {
            let widget = this.model

            let styles = {
                color: {
                    color: widget.colors.fonts
                },
                background: widget.colors.background,
                titleFontSize: `${this.data.WidgetLayout['titleFontSize'] || '22'}px`,
                valueFontSize: `${this.data.WidgetLayout['valueFontSize'] || '48'}px`,
                valueIconMinWidth: `${this.data.WidgetLayout['valueIconMinWidth'] || '48'}px`
            }

            if (this.displayBorder) {
                styles = {
                    ...styles,
                    ...{
                        border: `2px solid ${widget.colors.frames}`,
                    }
                }
            }
            return styles
        },
    },
    mounted () {
        this.layoutConfig = {
            titleFontSize: this.data.WidgetLayout['titleFontSize'] || 22,
            valueFontSize: this.data.WidgetLayout['valueFontSize'] || 48,
            valueIconMinWidth: this.data.WidgetLayout['valueIconMinWidth'] || 48
        }
    }
}
