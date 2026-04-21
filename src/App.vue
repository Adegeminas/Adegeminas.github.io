<script setup>
import { ref, computed } from 'vue'
import { useSharedSync } from './composables/useSharedSync.js'

const { openTabs, theme, toggleTheme, sharedWorkerSupported } = useSharedSync()

const email = ref('')
const emailError = ref('')

const subscribers = ref([
  'placeholder@example.com',
])

function isValidEmail(raw) {
  const s = String(raw).trim()
  const at = s.indexOf('@')
  if (at <= 0) return false
  const afterAt = s.slice(at + 1)
  return afterAt.includes('.')
}

function normalizeEmail(s) {
  return String(s).trim().toLowerCase()
}

function onEmailInput() {
  emailError.value = ''
}

function onSubmit(e) {
  e.preventDefault()
  const value = email.value
  if (!isValidEmail(value)) {
    emailError.value = 'Введите корректный email: нужны символ @ и точка после него.'
    return
  }
  const normalized = normalizeEmail(value)
  const exists = subscribers.value.some((x) => normalizeEmail(x) === normalized)
  if (exists) {
    email.value = ''
    emailError.value = ''
    return
  }
  subscribers.value = [...subscribers.value, value.trim()]
  email.value = ''
  emailError.value = ''
}

const cards = [
  {
    title: 'Аналитика',
    text:
      'Собирайте метрики и стройте отчёты в одном месте. Наглядные дашборды помогают команде быстрее принимать решения и видеть полную картину проекта без лишних переключений.',
    action: 'Подробнее',
  },
  {
    title: 'Интеграции',
    text:
      'Подключайте привычные сервисы через API и готовые коннекторы. Меньше ручной работы — больше времени на задачи, которые действительно двигают продукт вперёд.',
    action: 'Смотреть',
  },
  {
    title: 'Командная работа',
    text:
      'Роли, доступы и история изменений всегда под рукой. Обсуждайте правки в контексте и держите договорённости в одной цепочке, без потерянных сообщений.',
    action: 'Начать',
  },
  {
    title: 'Безопасность',
    text:
      'Шифрование, резервное копирование и контроль сессий по умолчанию. Вы сами задаёте политику доступа и можете в любой момент отозвать права у устройства или пользователя.',
    action: 'Узнать',
  },
]

const themeLabel = computed(() =>
  theme.value === 'dark' ? 'Тёмная тема' : 'Светлая тема',
)
</script>

<template>
  <div>
    <header>
      <h1 class="page-title">Тестовое задание</h1>
      <p class="tabs-badge" aria-live="polite">
        Открыто вкладок: <strong>{{ openTabs }}</strong>
      </p>
      <p v-if="!sharedWorkerSupported" class="tabs-badge" style="margin-top: 0.5rem">
        Shared Worker недоступен в этом браузере — счётчик вкладок локальный.
      </p>
    </header>

    <section class="section" aria-labelledby="cards-heading">
      <h2 id="cards-heading" class="section__heading">Карточки</h2>
      <div class="cards">
        <article v-for="(card, i) in cards" :key="i" class="card">
          <h3 class="card__title">{{ card.title }}</h3>
          <p class="card__text">{{ card.text }}</p>
          <button type="button" class="btn">{{ card.action }}</button>
        </article>
      </div>
    </section>

    <section class="section" aria-labelledby="subscribe-heading">
      <h2 id="subscribe-heading" class="section__heading">Подписка на рассылку</h2>
      <div class="subscribe">
        <form class="subscribe__row" novalidate @submit="onSubmit">
          <div class="subscribe__field-wrap">
            <label for="email-input" class="visually-hidden">Email</label>
            <input
              id="email-input"
              v-model="email"
              class="subscribe__input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="your@email.com"
              @input="onEmailInput"
            />
            <Transition name="error">
              <p v-if="emailError" class="subscribe__error">{{ emailError }}</p>
            </Transition>
          </div>
          <button type="submit" class="btn">Подписаться</button>
        </form>

        <div class="subscribers">
          <p class="subscribers__title">Подписчики</p>
          <ul>
            <li v-for="(item, idx) in subscribers" :key="idx + item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section theme-block" aria-labelledby="theme-heading">
      <h2 id="theme-heading" class="section__heading" style="width: 100%; margin-bottom: 0">
        Тема оформления
      </h2>
      <button type="button" class="btn btn--secondary" @click="toggleTheme">
        Переключить тему (сейчас: {{ themeLabel }})
      </button>
      <p class="theme-block__hint">
        Тема и счётчик вкладок синхронизируются между вкладками через Shared Worker.
      </p>
    </section>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
