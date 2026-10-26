<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
          @click="closeModal"
        ></div>

        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
          
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              {{ title }}
            </h3>
            <button
              @click="closeModal"
              class="p-1.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors active:scale-95"
              aria-label="Close modal"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto grow custom-scrollbar">
            <slot>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Modal content goes here...</p>
            </slot>
          </div>

          <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 shrink-0 transition-colors">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Action'
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Prevent background page scrolling while the modal is open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Restore body scrolling if component unmounts unexpectedly
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
@reference "tailwindcss";

/* Custom Scrollbar for the modal body */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-full;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  @apply bg-gray-300;
}

/* Modal Vue Transitions (Fade + Scale-up) */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Pop-up scale transition for the modal card container */
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(15px);
  opacity: 0;
}
</style>