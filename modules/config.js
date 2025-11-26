import Vue from './vue.shim.js';

const { createApp, ref, watch } = Vue;

// TODO: do we need this?
let app = null;

export default function runConfigApp(hostQuerySelector, cb) {
    app = createApp({
        setup() {
            const startYear = ref(2025);
            const startMonth = ref(11);

            const dowStart = ref(1);

            const locale = ref('en-US');

            const locales = [
                { name: 'English (US)', value: 'en-US' },
                { name: 'Russian (RU)', value: 'ru-RU' },
            ];

            watch([
                startYear, 
                startMonth, 
                
                dowStart,
                locale,
            ], () => {
                cb({
                    locale: locale.value,
                    start: {
                        year: startYear.value,
                        month: startMonth.value,
                    },
                    dowStart: dowStart.value,
                })
            })

            return {
                startYear,
                startMonth,
                dowStart,
                locale,
                locales,
            };
        }
    }).mount(hostQuerySelector);
}

function makeConfig() {
    return {
        startYear: startYear.value,
        startMonth: startMonth.value,
        startDate: startDate.value,
    }
}