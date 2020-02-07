/* eslint-disable */
(function($R)
{
  $R.add('plugin', 'icons', {
    translations: {
      en: {
        "icons": "Icons",
        "icons-select": "Please, select an icon"
      }
    },
    modals: {
      'icons': ''
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
      icons: {
        open: function($modal)
        {
          this._build($modal);
        }
      }
    },

    // public
    start: function()
    {
      if (!this.opts.icons) return;

      var data = {
        title:this.lang.get('icons'),
        api: 'plugin.icons.open'
      };

      var $button = this.toolbar.addButton('icons', data);
      $button.setIcon('<i class="el-icon-medal"></i>');
    },
    open: function(type)
    {
      var options = {
        title: this.lang.get('icons'),
        width: '600px',
        name: 'icons'
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
      $label.html(this.lang.parse('## icons-select ##:'));

      return $label;
    },
    _buildList: function()
    {
      var $list = $R.dom('<ul>');
      $list.addClass('redactor-icons-list');

      return $list;
    },
    _buildItems: function($list)
    {
      var items = this.opts.icons;
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
      var html = this.opts.icons[index][1];

      this.app.api('module.modal.close');
      this.insertion.insertRaw(html);
    }
  });
})(Redactor);
