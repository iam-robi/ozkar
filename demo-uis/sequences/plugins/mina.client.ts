import {defineNuxtPlugin} from "#app";


export default defineNuxtPlugin(( nuxtApp) => {
    nuxtApp.provide('mina', window.mina)
})