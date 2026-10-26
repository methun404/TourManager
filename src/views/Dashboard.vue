<template>
  <component :is="dashboardComponent" />
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import AdminDashboard from './AdminDashboard.vue'
import MemberDashboard from './MemberDashboard.vue'

const authStore = useAuthStore()

const dashboardComponent = computed(() =>
  authStore.userProfile.role === 'admin' ? AdminDashboard : MemberDashboard
)
</script>