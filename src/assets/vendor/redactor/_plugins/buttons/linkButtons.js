/* eslint-disable */
(function($R)
{
  $R.add('plugin', 'linkButton', {
    translations: {
      en: {
        "linkButton": "Buttons",
        "linkButton-select": "Please, select a button"
      }
    },
    modals: {
      'linkButton': ''
    },
    init: function(app)
    {
      this.app = app;
      this.opts = app.opts;
      this.lang = app.lang;
      this.toolbar = app.toolbar;
      this.insertion = app.insertion;
    },
    // messages
    onmodal: {
      linkButton: {
        open: function($modal)
        {
          this._build($modal);
        }
      }
    },

    // public
    start: function()
    {
      if (!this.opts.linkButton) return;

      var data = {
        title:this.lang.get('linkButton'),
        api: 'plugin.linkButton.open'
      };

      var $button = this.toolbar.addButton('linkButton', data);
      $button.setIcon('<i class="el-icon-thumb"></i>');
    },
    open: function(type)
    {
      var options = {
        title: this.lang.get('linkButton'),
        width: '600px',
        name: 'linkButton'
      };

      this.app.api('module.modal.build', options);
    },

    // private
    _build: function($modal)
    {
      var $body = $modal.getBody();
      var $label = this._buildLabel();
      var $list = this._buildList();

      this._buildItems($list);

      $body.html('');
      $body.append($label);
      $body.append($list);

    },
    _buildLabel: function()
    {
      var $label = $R.dom('<label>');
      $label.html(this.lang.parse('## linkButton-select ##:'));

      return $label;
    },
    _buildList: function()
    {
      var $list = $R.dom('<ul>');
      $list.addClass('redactor-linkButton-list');

      return $list;
    },
    _buildItems: function($list)
    {
      var items = this.opts.linkButton;
      for (var i = 0; i < items.length; i++)
      {
        var $li = $R.dom('<li>');
        var $item = $R.dom('<span>');

        $item.attr('data-index', i);
        $item.html(items[i][0]);
        $item.on('click', this._insert.bind(this));

        $li.append($item);
        $list.append($li);
      }
    },
    _insert: function(e)
    {
      var $item = $R.dom(e.target);
      var index = $item.attr('data-index');
      var html = this.opts.linkButton[index][1];

      this.app.api('module.modal.close');
      this.insertion.insertRaw(html);
    }
  });
})(Redactor);
