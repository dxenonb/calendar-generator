import Vue from '../vue.shim.js';

const { defineModel, computed, ref, watch } = Vue;

export default {
    props: {
        label: String,
        styleVar: String,
        modelValue: Object,
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const getId = (suffix) =>
            `cfg-font-${props.styleVar}-${suffix}`;

        const updateModelValue = (prop, value) => {
            const newValue = { ...props.modelValue };
            newValue[prop] = `${value}`;
            ctx.emit('update:modelValue', newValue);
        };

        return {
            getId,
            updateModelValue,
        };
    },
    template: `
        <div>
            <h3>{{label}}</h3>

            <div class="font-config">
                <div>
                    <label :for="getId('font-family')">
                        Font Family
                    </label>
                    <input :id="getId('font-family')" type="text" :value="modelValue['font-family']" @change="(e) => updateModelValue('font-family', e.target.value)">
                </div>

                <div style="width: 100px">
                    <label :for="getId('font-size')">
                        Font Size
                    </label>
                    <input :id="getId('font-size')" class="w-100" type="number" :value="modelValue['font-size']" @change="(e) => updateModelValue('font-size', e.target.value)">
                </div>

                <div style="width: 100px">
                    <label :for="getId('font-weight')">
                        Weight
                    </label>
                    <input :id="getId('font-weight')" class="w-100" :value="modelValue['font-weight']" @change="(e) => updateModelValue('font-weight', e.target.value)">
                </div>

                <div style="width: 100px">
                    <label :for="getId('font-style')">
                        Style
                    </label>
                    <input :id="getId('font-style')" class="w-100" :value="modelValue['font-style']" @change="(e) => updateModelValue('font-style', e.target.value)">
                </div>
            </div>
        </div>
    `
}