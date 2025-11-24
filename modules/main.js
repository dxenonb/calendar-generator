import luxon from './luxon.shim.js';
const { DateTime } = luxon;

export const defaultConfig = () => ({
    locale: 'zh-ZH',
    dowStart: 1,
    dowCount: 7,
    startDate: DateTime.fromISO("2025-11-01"),
    maxCalendarRows: 5,
    styleVars: {
        '--page-header-font-family': 'monospace',
        '--page-header-font-size': '18px',

        '--calendar-header-font-family': '"Lobster", sans-serif',
        '--calendar-header-font-family': '"Great Vibes", sans-serif',
        '--calendar-header-font-size': '24px',

        '--calendar-font-family': 'sans-serif',
    },
});

export function main() {
    renderFullCalendar();
}

export function renderFullCalendar() {
    const config = defaultConfig();
    config.startDate = config.startDate.setLocale(config.locale);

    config.dow = [];
    {
        // hack to get localized day names
        // 2025-06-01 is a Sunday (weekday=0 in our system)
        let dt = DateTime.fromISO('2025-06-01', { locale: config.locale });
        for (let i=0; i < 7;i+=1) {
            config.dow.push(dt.toFormat('cccc'));
            dt = dt.plus({ days: 1 });
        }

    }

    const host = document.getElementById('target');

    for (const key of Object.keys(config.styleVars)) {
        const value = config.styleVars[key];
        host.style.setProperty(key, value);
    }

    const startDate = config.startDate;
    renderMonth(host, config, { startDate, pageNumber: 1 });
}

export function renderMonth(host, config, instance) {
    const {
        startDate,
        pageNumber,
    } = instance;

    const page1Days = 4;
    const page2Days = 7 - page1Days;
    const firstDow = calDow(config, startDate);

    let dt = startDate.plus({ days: -firstDow - 1 })

    const page1 = renderPage(config, {
        header: startDate.toFormat('LLLL'),
        cols: page1Days,
        month: startDate.month,
        startDate: dt,
        pageNumber,
    });
    host.appendChild(page1);

    const page2 = renderPage(config, {
        header: '2025',
        cols: page2Days,
        month: startDate.month,
        startDate: dt.plus({ days: page1Days }),
        pageNumber: pageNumber + 1,
        className: 'alt',
        hasNotes: true,
    });
    host.appendChild(page2);
}

function renderPage(config, instance) {
    const {
        header: headerText,
        cols,
        month,
        startDate,
        pageNumber,
        className,
        hasNotes,
    } = instance;

    const pageClass = className || '';

    const skipDays = config.dow.length - cols;
    let dt = startDate;

    const th = dowSlice(config.dow, dt.weekday, cols);

    const rows = [];
    for (let y=0; y < config.maxCalendarRows; y+=1) {
        const row = [];
        for (let x=0; x < cols; x+=1) {
            if (dt.month === month) {
                row.push(renderCalendarDay('', dt.day));
            } else {
                row.push(renderCalendarDay('out-of-month', dt.day));
            }

            dt = dt.plus({ days: 1 });
        }

        rows.push(row);
        dt = dt.plus({ days: skipDays });
    }

    const header = $('header', [$('h2', headerText)]);
    const tbody = $('tbody', rows.map(r => $('tr', r)));

    const table = $('table', 'calendar', [
        $('thead', [
            $('tr', th.map(i => $('th', i)))
        ]),
        tbody,
    ]);

    const footer = $('footer', [$('span', 'page-num', pageNumber)]);

    let body = table;
    if (hasNotes) {
        const noteLines = [
            $('h2', 'Notes'),
        ]
        for (let i=0; i < 33;i+=1) {
            noteLines.push($('div', 'line', []));
        }
        const notes = $('div', 'notes', noteLines);

        body = $('div', 'calendar-wrapper', [
            table,
            notes,
        ]);
    }

    const template = $(
        'section', 
        `page page-break ${pageClass}`,
        [
            header,
            body,
            footer
        ]
    );

    return template;
}

function renderCalendarDay(className, day) {
    const c = [
        $('p', day),
    ];
    for(let i=0;i<5;i+=1) {
        c.push($('div', 'line', []));
    }

    return $('td', className, c);
}

export function calDow(config, dt) {
    // in luxon, 1 is Monday, 7 is Sunday, so we subtract 1 to get to 0-based weekday
    const dow = dt.weekday - 1;
    return (dow - config.dowStart) % 7;
}

export function dowSlice(dow, start, count) {
    const result = [];
    const len = dow.length;
    start = start % len;
    for (let i = 0; i < count; i += 1) {
        result.push(dow[(start + i) % len]);
    }
    return result;
}

function $(el, classesOrChildren, children) {
    let classes;
    if (children === undefined) {
        children = classesOrChildren;
        classes = '';
    } else {
        classes = classesOrChildren;
    }

    el = document.createElement(el);
    el.className = classes;

    if (children !== undefined) {
        if (typeof children !== 'object') {
            el.appendChild(document.createTextNode(children));
        } else {
            for (const c of children) {
                el.appendChild(c);
            }
        }
    }

    return el;
}