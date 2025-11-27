import Vue from './vue.shim.js';
import FontConfig from './components/font-config.js';

const { createApp, ref, watch, reactive } = Vue;

// TODO: do we need this?
let app = null;

export default function runConfigApp(hostQuerySelector, cb) {
    app = createApp({
        components: {
            FontConfig
        },
        setup() {
            const startYear = ref(new Date().getFullYear());
            const startMonth = ref(new Date().getMonth() + 1);

            const dowStart = ref(1);

            const locale = ref(navigator.language);

            // const locales = [
            //     { name: 'English (US)', value: 'en-US' },
            //     { name: 'Russian (RU)', value: 'ru-RU' },
            // ];

            const styleVars = reactive({
                'page-header': {
                    'font-family': 'Arial',
                    'font-size': 18,
                    'font-weight': 'normal',
                    'font-style': 'normal',
                },
                'calendar-header': {
                    'font-family': 'Arial',
                    'font-size': 24,
                    'font-weight': 'normal',
                    'font-style': 'normal',
                },
                'calendar': {
                    'font-family': 'Courier New',
                    'font-size': 12,
                    'font-weight': 'normal',
                    'font-style': 'normal',
                },
            });

            watch([
                startYear, 
                startMonth, 
                
                dowStart,
                locale,
                styleVars,
            ], () => {
                cb({
                    locale: locale.value,
                    start: {
                        year: startYear.value,
                        month: startMonth.value,
                    },
                    dowStart: dowStart.value,
                    styleVars: lowerStyleVars(styleVars),
                })
            }, { immediate: true });

            return {
                startYear,
                startMonth,
                dowStart,
                locale,
                // locales,
                styleVars,
            };
        }
    }).mount(hostQuerySelector);
}

function lowerStyleVars(styleVars) {
    const result = {};
    for (const key of Object.keys(styleVars)) {
        const bundle = styleVars[key];
        for (const prop of Object.keys(bundle)) {
            const lowered = `--${key}-${prop}`;

            if (prop === 'font-size') {
                result[lowered] = `${bundle[prop]}px`;
            } else {
                result[lowered] = bundle[prop];
            }
        }
    }
    return result;
}

function makeConfig() {
    return {
        startYear: startYear.value,
        startMonth: startMonth.value,
        startDate: startDate.value,
    }
}