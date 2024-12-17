import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    default_locale: 'en',
    description: '__MSG_extension_description__',
    name: '__MSG_extension_name__',
    permissions: ["storage", "contextMenus", "activeTab"],
    action: {},
  },
  modules: [
    '@wxt-dev/module-react',
    '@wxt-dev/i18n/module',
  ],
  srcDir: 'src',
})
