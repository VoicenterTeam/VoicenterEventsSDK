(function ($R) {
    $R.add('plugin', 'customfontsize', {
        translations: {
            en: {
                "buttonTitle": "Font size",
                "customfontsize": "Set custom Font Size",
                "customfontsize-label": "Type a value (between 1 and 200)",
                "apply": "Apply",
            }
        },
        modals: {
            'customfontsize': '<form action="">'
                + '<div class="form-item">'
                + '<label>## customfontsize-label ##</label>'
                + '<input min="1" max="200" name="fontSize" type="number" style="height: 35px;"></input>'
                + '<div id="validation-message" style="display: none; margin-top: 5px; color: red; font-size:14px;">The value should be between 1 and 200.</div>'
                + '</div>'
                + '</form>'
        },
        init: function (app) {
            this.app = app;
            this.lang = app.lang;
            this.inline = app.inline;
            this.toolbar = app.toolbar;
        },
        start: function () {
            const buttonData = {
                title: this.lang.get('buttonTitle'),
                api: 'plugin.customfontsize.open'
            };

            this.toolbar.addButton('customfontsize', buttonData);
        },

        onmodal: {
            customfontsize: {
                opened: function ($modal, $form) {
                    $form.getField('fontSize').focus();
                },
                submit: function ($modal, $form) {
                    const data = $form.getData();
                    const value = data.fontSize
                    this._apply(value);
                }
            }
        },
        open: function () {
            let options = {
                title: this.lang.get('customfontsize'),
                width: '600px',
                name: 'customfontsize',
                handle: 'submit',
                commands: {
                    cancel: {title: this.lang.get('cancel')},
                    submit: {title: this.lang.get('apply')}
                }
            };

            this.app.api('module.modal.build', options);
        },

        _apply: function (size) {

            if (size < 1 || size > 200) {
                let elem = document.getElementById('validation-message');
                elem.style.display = 'block';
                return;
            }

            let args = {
                tag: 'span',
                style: {'font-size': size + 'px'},
                type: 'toggle'
            };

            this.app.api('module.modal.close');

            this.inline.format(args);
        }
    });
})(Redactor);
