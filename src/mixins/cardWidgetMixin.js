export default {
    computed: {
        getCardStyles () {
            let widget = this.model
            let minMaxHeight = this.data.WidgetLayout['maxHeight']

            let styles = {
                color: {
                    'color': widget.colors.fonts
                },
                'background': widget.colors.background,
                'max-width': `${this.data.WidgetLayout['maxWidth'] || '400'}px`,
                'min-width': `${this.data.WidgetLayout['minWidth'] || '250'}px`,
                'max-height': `${minMaxHeight || '200'}px`,
                'min-height': `${this.data.WidgetLayout['minHeight'] || '100'}px`,
                'titleFontSize': `${this.data.WidgetLayout['titleFontSize'] || '22'}px`,
                'valueFontSize': `${this.data.WidgetLayout['valueFontSize'] || '64'}px`,
            }

            if (this.displayBorder) {
                styles = {
                    ...styles,
                    ...{
                        'border': `2px solid ${widget.colors.frames}`,
                    }
                }
            }
            return styles
        },
    },
    mounted () {
        this.layoutConfig = {
            maxWidth: this.data.WidgetLayout['maxWidth'] || '400',
            minWidth: this.data.WidgetLayout['minWidth'] || '250',
            maxHeight: this.data.WidgetLayout['maxHeight'] || 'auto',
            minHeight: this.data.WidgetLayout['minHeight'] || '100',
            titleFontSize: this.data.WidgetLayout['titleFontSize'] || 22,
            valueFontSize: this.data.WidgetLayout['valueFontSize'] || 64,
        }
    }
}
