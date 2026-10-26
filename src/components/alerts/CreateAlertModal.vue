<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm" @click="$emit('close')"></div>

        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">
              {{ isEditing ? 'Edit Alert' : 'Create New Alert' }}
            </h3>
            <button @click="$emit('close')"
              class="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-5 overflow-y-auto flex flex-col gap-5">

            <!-- Type Selector -->
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Alert Type</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="t in types" :key="t.id" type="button" @click="form.type = t.id"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                  :class="form.type === t.id
                    ? `${t.activeBg} ${t.activeBorder} scale-[1.02] shadow-sm`
                    : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 hover:bg-gray-100 dark:hover:bg-slate-800'">
                  <component :is="t.icon" class="w-5 h-5" :class="form.type === t.id ? t.activeText : 'text-gray-400 dark:text-gray-500'" />
                  <span class="text-[10px] font-bold" :class="form.type === t.id ? t.activeText : 'text-gray-500 dark:text-gray-400'">
                    {{ t.label }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Title -->
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                {{ form.type === 'poll' ? 'Poll Question' : 'Title' }}
              </label>
              <input v-model="form.title" type="text" required
                :placeholder="form.type === 'poll' ? 'e.g. Where should we eat tonight?' : 'e.g. Important Update'"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
            </div>

            <!-- Message (Announcement/Reminder only) -->
            <div v-if="form.type !== 'poll'">
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea v-model="form.message" rows="3"
                placeholder="Write your message here..."
                class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 resize-none transition-colors" />
            </div>

            <!-- Poll Options -->
            <div v-if="form.type === 'poll'">
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Options</label>
                <button type="button" @click="addOption"
                  class="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                  <Plus class="w-3.5 h-3.5" /> Add Option
                </button>
              </div>
              <div class="flex flex-col gap-2">
                <div v-for="(opt, idx) in form.options" :key="opt.id" class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <input v-model="opt.text" type="text" :placeholder="`Option ${idx + 1}`"
                    class="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
                  <button v-if="form.options.length > 2" type="button" @click="removeOption(idx)"
                    class="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Allow Multiple Toggle -->
              <div class="mt-4 flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl transition-colors">
                <div>
                  <p class="text-sm font-bold text-gray-800 dark:text-gray-100">Allow Multiple Choices?</p>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400">Members can select more than one option</p>
                </div>
                <button type="button" @click="form.allowMultiple = !form.allowMultiple"
                  class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
                  :class="form.allowMultiple ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 shadow-sm absolute top-1"
                    :class="form.allowMultiple ? 'left-6' : 'left-1'" />
                </button>
              </div>
            </div>

            <!-- Optional End Date -->
            <div>
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                End Date <span class="text-gray-400 dark:text-gray-500 font-normal normal-case">(Optional)</span>
              </label>
              <input v-model="form.endsAt" type="datetime-local"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
            </div>

          </div>

          <!-- Footer Buttons -->
          <div class="px-5 py-4 border-t border-gray-100 dark:border-slate-800 flex gap-3 shrink-0">
            <button type="button" @click="$emit('close')"
              class="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors active:scale-95">
              Cancel
            </button>
            <button type="button" @click="handleSubmit" :disabled="isSubmitting || !isFormValid"
              class="flex-1 py-3 font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-60 flex justify-center items-center gap-2"
              :class="form.type === 'poll'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/30'
                : form.type === 'reminder'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-200 dark:shadow-orange-900/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200 dark:shadow-blue-900/30'">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>{{ isEditing ? 'Save Changes' : 'Create Alert' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Plus, Trash2, BarChart3, Bell, AlarmClock } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  editingAlert: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const isEditing = computed(() => !!props.editingAlert)
const isSubmitting = ref(false)

const types = [
  { id: 'poll', label: 'Poll', icon: BarChart3, activeBg: 'bg-indigo-50 dark:bg-indigo-900/30', activeBorder: 'border-indigo-300 dark:border-indigo-700', activeText: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'announcement', label: 'Announce', icon: Bell, activeBg: 'bg-blue-50 dark:bg-blue-900/30', activeBorder: 'border-blue-300 dark:border-blue-700', activeText: 'text-blue-600 dark:text-blue-400' },
  { id: 'reminder', label: 'Reminder', icon: AlarmClock, activeBg: 'bg-amber-50 dark:bg-amber-900/30', activeBorder: 'border-amber-300 dark:border-amber-700', activeText: 'text-amber-600 dark:text-amber-400' },
]

const makeDefaultForm = () => ({
  type: 'poll',
  title: '',
  message: '',
  allowMultiple: false,
  endsAt: '',
  options: [
    { id: crypto.randomUUID(), text: '', votes: [] },
    { id: crypto.randomUUID(), text: '', votes: [] },
  ],
})

const form = ref(makeDefaultForm())

// When editing an existing alert, populate the form
watch(() => props.editingAlert, (val) => {
  if (val) {
    form.value = {
      type: val.type || 'poll',
      title: val.title || '',
      message: val.message || '',
      allowMultiple: val.allowMultiple || false,
      endsAt: val.endsAt ? val.endsAt.slice(0, 16) : '',
      options: val.options ? val.options.map(o => ({ ...o })) : makeDefaultForm().options,
    }
  } else {
    form.value = makeDefaultForm()
  }
}, { immediate: true })

const addOption = () => {
  form.value.options.push({ id: crypto.randomUUID(), text: '', votes: [] })
}

const removeOption = (idx) => {
  form.value.options.splice(idx, 1)
}

const isFormValid = computed(() => {
  if (!form.value.title.trim()) return false
  if (form.value.type === 'poll') {
    return form.value.options.length >= 2 && form.value.options.every(o => o.text.trim())
  }
  return true
})

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  isSubmitting.value = true

  const payload = {
    type: form.value.type,
    title: form.value.title.trim(),
    message: form.value.message.trim(),
    endsAt: form.value.endsAt ? new Date(form.value.endsAt).toISOString() : null,
  }

  if (form.value.type === 'poll') {
    payload.allowMultiple = form.value.allowMultiple
    // Keep existing votes if editing, else fresh
    payload.options = form.value.options.map(o => ({
      id: o.id,
      text: o.text.trim(),
      votes: o.votes || [],
    }))
  }

  emit('submit', { payload, isEditing: isEditing.value, id: props.editingAlert?.id })
  isSubmitting.value = false
}
</script>

<style scoped>
@reference "tailwindcss";

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative {
  transform: translateY(30px);
  opacity: 0;
}
</style>
