'use strict';

function IconPicker (conf) {
  this.iconList = conf.iconList;
  this.filterString = null;

  this.dom = buildDom(this.iconList, {
    onSelect: function(icon) {
      this.select(icon.id);
    }.bind(this),
    onDblClick: function(icon) {
      conf.onDblClick(icon);
    }.bind(this),
    onKeyDown: function(id) {
      this.select(id);
    }.bind(this),
    onTabBack: function(e) {
      conf.onTabBack(e);
    }
  });

  if (conf.selected) {
    this.select(conf.selected);
  } else {
    this.select(this.iconList[0].id);
  }
}

IconPicker.prototype.select = function(id) {
  var icon;
  if (id) {
    icon = findById(this.iconList, id);
  }
  if (icon) {
    this.selected = icon;
  } else {
    this.selected = this.iconList[0];
  }
  updateSelection(this.dom, this.selected.id);
};

IconPicker.prototype.selectNext = function(direction) {
  var nextItem = getNextItem(this.dom, direction);
  if (nextItem) {
    var id = getIconId(nextItem);
    this.select(id);
  }
}

IconPicker.prototype.getSelected = function() {
  return this.selected;
};

IconPicker.prototype.getDom = function() {
  return this.dom;
};

IconPicker.prototype.focus = function() {
  markSelected(this.dom, this.selected.id, true);
};

IconPicker.prototype.filter = function(filter) {
  this.filterString = filter;
  var visibleIconIds = getVisibleIconIds(this.iconList, this.filterString);
  updateVisibility(this.dom, visibleIconIds);
  if (visibleIconIds.indexOf(this.selected.id) === -1 && visibleIconIds.length > 0) {
    this.select(visibleIconIds[0]);
  }
};

IconPicker.prototype.resetFilter = function() {
  this.filter(null);
}

function findById(iconList, id) {
  return iconList.find(function(icon) {
    return icon.id === id;
  });
}

function getVisibleIconIds(iconList, filter) {
  return iconList.filter(function(icon) {
    return !filter || icon.id.indexOf(filter) > -1;
  }).map(function(icon) {
    return icon.id;
  });
}

function updateVisibility(container, visibleIconIds) {
  var items = container.find('.icon');
  for (var i = 0; i < items.count(); i++) {
    var item = items.getItem(i);
    var iconId = getIconId(item);
    if (visibleIconIds.indexOf(iconId) > -1) {
      item.show();
    } else {
      item.hide();
    }
  }
}

function buildDom(iconList, handlers) {
  var $el = CKEDITOR.dom.element;

  var container = CKEDITOR.dom.element.createFromHtml('<div class="icons-container"></div>');

  for (var i = 0; i < iconList.length; i++) {
    var icon = iconList[i];
    var itemHtml =
      '<div class="icon icon-' + icon.id + '" tabindex="-1">' +
        '<i class="fa fa-' + icon.id + '"></i>' +
      '</div>';

    var item = CKEDITOR.dom.element.createFromHtml(itemHtml, CKEDITOR.document);

    item.on('click', onSelect, null, {
      container: container,
      item: item,
      icon: icon,
      handler: handlers.onSelect
    });
    item.on('dblclick', onDblClick, null, {
      container: container,
      item: item,
      icon: icon,
      handler: handlers.onDblClick
    });
    item.on('mouseover', onMouseOver, null, {
      container: container,
      item: item,
      icon: icon
    });
    item.on('mouseout', onMouseOut, null, {
      container: container,
      item: item,
      icon: icon
    });
    item.on('keydown', onKeyDown, null, {
      container: container,
      item: item,
      icon: icon,
      handler: handlers.onKeyDown,
      tabBackHandler: handlers.onTabBack
    });

    container.append(item);
  }

  return container;
}

function onSelect(e) {
  e.listenerData.handler(e.listenerData.icon);
}

function updateSelection(container, id) {
  unmarkSelected(container);
  markSelected(container, id);
}

function unmarkSelected(container) {
  var markedSelected = container.findOne('.selected');
  if (markedSelected) {
    markedSelected.removeClass('selected');
  }
}

function selectItem(item, focus) {
  item.addClass('selected');
  if (focus === true) {
    item.focus();
  } else {
    item.scrollIntoView();
  }
}

function markSelected(container, id, focus) {
  var item = container.findOne('.icon-' + id);
  if (!item) {
    item = container.findOne('.icon');
  }
  if (item) {
    selectItem(item, focus);
  }
}

function onDblClick(e) {
  e.listenerData.handler(e.listenerData.icon);
}

function onMouseOver(e) {
  e.listenerData.item.addClass('over');
}

function onMouseOut(e) {
  e.listenerData.item.removeClass('over');
}

function onKeyDown(e) {
  if (e.data.$.keyCode === 9 && e.data.$.shiftKey === true) {
    e.listenerData.tabBackHandler({
      originalEvent: e
    });
    return;
  }

  var container = e.listenerData.container;
  var keyIdentifier = e.data.$.keyIdentifier;
  var next = getNextItem(container, keyIdentifier);
  if (next) {
    var id = getIconId(next);
    if (id) {
      e.listenerData.handler(id);
    }
  }
}

function getNextItem(container, direction) {
  var item = container.findOne('.selected');
  var position = getPosition(container, item);
  var newPosition = getNewPosition(position, direction);
  var newIndex = newPosition.row * position.totalColumns + newPosition.column;
  return getVisibleChild(container, newIndex);
}

function getNewPosition(position, direction) {
  var newPos = {
    row: position.row,
    column: position.column
  }

  direction = direction.toLowerCase();

  var columnsInLastRow = position.visibleItemsCount % position.totalColumns;
  if (columnsInLastRow === 0) {
    columnsInLastRow = position.totalColumns;
  }

  var totalRows = position.totalRows;
  var totalColumns = position.totalColumns;

  var columnsInCurrentRow = (position.row === totalRows - 1) ? columnsInLastRow : totalColumns;
  var rowsInCurrentColumn = (position.column < columnsInLastRow) ? totalRows : totalRows - 1;

  if (direction === 'right') {
    newPos.column = (newPos.column + 1) % columnsInCurrentRow;
  } else if (direction === 'left') {
    newPos.column--;
    if (newPos.column < 0) {
      newPos.column = columnsInCurrentRow + newPos.column;
    }
  } else if (direction === 'down') {
    newPos.row = (newPos.row + 1) % rowsInCurrentColumn;
  } else if (direction === 'up') {
    newPos.row--;
    if (newPos.row < 0) {
      newPos.row = rowsInCurrentColumn + newPos.row;
    }
  }

  return newPos;
}

function getVisibleChild(container, index) {
  var items = container.getChildren();
  var visibleIndex = -1;
  for (var i = 0; i < items.count(); i++) {
    var item = items.getItem(i);
    if (item.isVisible()) {
      visibleIndex++;
      if (visibleIndex === index) {
        return item;
      }
    }
  }
  return null;
}

function repeat(func, count, initialArg) {
  var ret = func(initialArg);
  for (var i = 0; i < count - 1 && ret; i++) {
    ret = func(ret);
  }
  return ret;
}

function getIconId(item) {
  var classes = item.$.className.split(' ');
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].startsWith('icon-')) {
      return classes[i].replace('icon-', '');
    }
  }
  return null;
}

function getPosition(container, item) {
  var containerHeight = container.$.offsetHeight;
  var containerWidth = container.$.offsetWidth;

  var itemHeight = item.$.offsetHeight;
  var itemWidth = item.$.offsetWidth;

  var itemTop = item.$.offsetTop;
  var itemLeft = item.$.offsetLeft;

  var totalRows = containerHeight / itemHeight;
  var totalColumns = containerWidth / itemWidth;

  var row = itemTop / itemHeight;
  var column = itemLeft / itemWidth;

  var countVisible = function() {
    var count = 0;

    return {
      getCount: function() {
        return count;
      },
      item: function(item) {
        if (item.isVisible()) {
          count++;
        }
      }
    }
  }();

  withItems(container, countVisible.item);

  return {
    row: row,
    column: column,
    totalRows: totalRows,
    totalColumns: totalColumns,
    visibleItemsCount: countVisible.getCount()
  }
}

function withItems(container, withItem) {
  var items = container.getChildren();
  for (var i = 0; i < items.count(); i++) {
    var item = items.getItem(i);
    if (item.isVisible()) {
      var result = withItem(item);
      if (result === false) {
        return;
      }
    }
  }

}

module.exports = IconPicker;

