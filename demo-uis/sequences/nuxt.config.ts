// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt","@nuxtjs/tailwindcss","@nuxtjs/color-mode"],
  pinia: {
    storesDirs: ['./store/**'],
  },
  colorMode: {
    preference: 'night', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
  },

})
