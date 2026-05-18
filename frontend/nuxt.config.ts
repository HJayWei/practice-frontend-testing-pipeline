export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],

  devServer: {
    host: '0.0.0.0',
  },

  typescript: {
    strict: true,
  },
})
