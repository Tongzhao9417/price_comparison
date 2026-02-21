(function () {
  const SORTABLE_COLUMNS = [0, 2];
  const ICONS = {
    none: '↕',
    asc: '▲',
    desc: '▼',
  };

  function toElement(target) {
    if (!target) {
      return null;
    }
    if (target.nodeType === Node.ELEMENT_NODE) {
      return target;
    }
    if (target.nodeType === Node.TEXT_NODE) {
      return target.parentElement || null;
    }
    return null;
  }

  function getCellText(row, columnIndex) {
    const cell = row.cells[columnIndex];
    return cell ? (cell.textContent || '').trim() : '';
  }

  function parsePriceValue(text) {
    const normalized = text.replace(/,/g, '');
    const match = normalized.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.NaN;
  }

  function compareTextRows(aRow, bRow, columnIndex, direction) {
    const aText = getCellText(aRow, columnIndex);
    const bText = getCellText(bRow, columnIndex);
    const result = aText.localeCompare(bText, 'zh-CN', {
      numeric: true,
      sensitivity: 'base',
    });
    return direction === 'asc' ? result : -result;
  }

  function comparePriceRows(aRow, bRow, columnIndex, direction) {
    const aValue = parsePriceValue(getCellText(aRow, columnIndex));
    const bValue = parsePriceValue(getCellText(bRow, columnIndex));
    const aValid = Number.isFinite(aValue);
    const bValid = Number.isFinite(bValue);

    if (!aValid && !bValid) {
      return 0;
    }
    if (!aValid) {
      return 1;
    }
    if (!bValid) {
      return -1;
    }

    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  }

  function updateHeaderStates(headers, activeColumn, direction) {
    headers.forEach(function (th, index) {
      if (!th.classList.contains('sortable-col')) {
        return;
      }

      const indicator = th.querySelector('.sort-indicator');
      if (!indicator) {
        return;
      }

      if (index === activeColumn) {
        th.classList.add('active-sort');
        th.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
        indicator.textContent = direction === 'asc' ? ICONS.asc : ICONS.desc;
      } else {
        th.classList.remove('active-sort');
        th.setAttribute('aria-sort', 'none');
        indicator.textContent = ICONS.none;
      }
    });
  }

  function ensureHeaderDecorations(table) {
    const thead = table.tHead;
    if (!thead || !thead.rows[0]) {
      return;
    }

    const headerRow = thead.rows[0];
    SORTABLE_COLUMNS.forEach(function (columnIndex) {
      const th = headerRow.cells[columnIndex];
      if (!th) {
        return;
      }

      th.classList.add('sortable-col');
      th.setAttribute('role', 'button');
      if (!th.hasAttribute('aria-sort')) {
        th.setAttribute('aria-sort', 'none');
      }
      th.setAttribute('title', '点击排序');
      if (th.tabIndex < 0) {
        th.tabIndex = 0;
      }

      if (!th.querySelector('.sort-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.textContent = ICONS.none;
        indicator.setAttribute('aria-hidden', 'true');
        th.appendChild(indicator);
      }
    });
  }

  function sortTableByColumn(table, columnIndex) {
    const thead = table.tHead;
    const tbody = table.tBodies[0];
    if (!thead || !tbody || !thead.rows[0]) {
      return;
    }

    const headers = Array.from(thead.rows[0].cells);
    const currentColumn = table.dataset.sortColumn ? Number(table.dataset.sortColumn) : null;
    const currentDirection = table.dataset.sortDirection === 'asc' ? 'asc' : 'desc';
    const nextDirection = currentColumn === columnIndex && currentDirection === 'asc' ? 'desc' : 'asc';

    const rows = Array.from(tbody.rows);
    const comparator =
      columnIndex === 2
        ? function (aRow, bRow) {
            return comparePriceRows(aRow, bRow, columnIndex, nextDirection);
          }
        : function (aRow, bRow) {
            return compareTextRows(aRow, bRow, columnIndex, nextDirection);
          };

    rows.sort(comparator);
    rows.forEach(function (row) {
      tbody.appendChild(row);
    });

    table.dataset.sortColumn = String(columnIndex);
    table.dataset.sortDirection = nextDirection;
    updateHeaderStates(headers, columnIndex, nextDirection);
  }

  function getSortableHeaderContext(eventTarget) {
    const element = toElement(eventTarget);
    if (!element) {
      return null;
    }

    const table = element.closest('.theme-doc-markdown table');
    if (!table || !table.tHead || !table.tHead.rows[0]) {
      return null;
    }

    const th = element.closest('th');
    if (!th || th.parentElement !== table.tHead.rows[0]) {
      return null;
    }

    const columnIndex = Array.prototype.indexOf.call(table.tHead.rows[0].cells, th);
    if (!SORTABLE_COLUMNS.includes(columnIndex)) {
      return null;
    }

    return {table: table, columnIndex: columnIndex};
  }

  function initializeTables() {
    const tables = document.querySelectorAll('.theme-doc-markdown table');
    tables.forEach(function (table) {
      ensureHeaderDecorations(table);
    });
  }

  function bindGlobalHandlers() {
    if (document.documentElement.dataset.tableSortBound === 'true') {
      return;
    }

    document.addEventListener('click', function (event) {
      const context = getSortableHeaderContext(event.target);
      if (!context) {
        return;
      }

      ensureHeaderDecorations(context.table);
      sortTableByColumn(context.table, context.columnIndex);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const context = getSortableHeaderContext(event.target);
      if (!context) {
        return;
      }

      event.preventDefault();
      ensureHeaderDecorations(context.table);
      sortTableByColumn(context.table, context.columnIndex);
    });

    document.documentElement.dataset.tableSortBound = 'true';
  }

  function start() {
    bindGlobalHandlers();
    initializeTables();
  }

  start();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  }

  window.addEventListener('load', start);

  const observer = new MutationObserver(function () {
    initializeTables();
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }
})();
