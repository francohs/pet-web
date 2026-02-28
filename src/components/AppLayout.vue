<template>
  <div class="min-h-screen bg-neutral-50">
    <nav class="bg-white border-b border-neutral-200 px-4 py-3">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="text-lg font-semibold">🐾 PetCare</span>
          <div class="flex items-center gap-1">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              active-class="bg-neutral-100 text-neutral-900"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
        <Button variant="outline" size="sm" @click="handleLogout">
          Logout
        </Button>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";

const router = useRouter();
const authStore = useAuthStore();

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/pets", label: "Pets" },
  { to: "/appointments", label: "Appointments" },
  { to: "/reminders", label: "Reminders" },
];

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>
