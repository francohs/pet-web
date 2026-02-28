<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div class="text-4xl mb-2">🐾</div>
        <CardTitle class="text-2xl">Create an account</CardTitle>
        <CardDescription>Start managing your pets today</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input
              id="name"
              v-model="name"
              type="text"
              placeholder="Franco"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="franco@test.com"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Creating account..." : "Create account" }}
          </Button>
        </form>
        <p class="text-center text-sm text-neutral-500 mt-4">
          Already have an account?
          <RouterLink
            to="/login"
            class="text-neutral-900 font-medium hover:underline"
          >
            Sign in
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleRegister() {
  loading.value = true;
  error.value = "";
  try {
    await authStore.register(name.value, email.value, password.value);
    router.push("/");
  } catch {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
