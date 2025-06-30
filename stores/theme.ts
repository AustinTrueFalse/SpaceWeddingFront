import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
  }),
  actions: {
    /**
     * Инициализация темы (запускай внутри компонента, передай useTheme)
     */
    initTheme(theme: any) {
      const saved = this.getCookie('theme')
      this.isDark = saved === 'dark'
      theme.global.name.value = this.isDark ? 'dark' : 'light'
    },

    /**
     * Переключение темы (внутри компонента, передай useTheme)
     */
    toggleTheme(theme: any) {
      this.isDark = !this.isDark
      const newTheme = this.isDark ? 'dark' : 'light'
      theme.global.name.value = newTheme
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000`
    },

    /**
     * Чтение куки
     */
    getCookie(name: string): string | null {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? match[2] : null
    },
  },
})
