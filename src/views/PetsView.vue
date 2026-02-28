<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Pets</h1>
        <Button @click="showDialog = true">Add Pet</Button>
      </div>

      <div v-if="isLoading" class="text-sm text-neutral-500">Loading...</div>

      <div v-else-if="!pets?.length" class="text-center py-12 text-neutral-500">
        No pets yet. Add your first pet!
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="pet in pets"
          :key="pet._id"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="router.push(`/pets/${pet._id}`)"
        >
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span>{{ speciesEmoji(pet.species) }}</span>
              <span>{{ pet.name }}</span>
            </CardTitle>
            <CardDescription
              >{{ pet.species }} · {{ pet.breed }}</CardDescription
            >
          </CardHeader>
          <CardContent>
            <p v-if="pet.birthDate" class="text-sm text-neutral-500">
              Born {{ formatDate(pet.birthDate) }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    <Dialog v-model:open="showDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new pet</DialogTitle>
          <DialogDescription
            >Fill in the details below to add a new pet.</DialogDescription
          >
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleCreate">
          <div class="space-y-2">
            <Label>Name</Label>
            <Input v-model="form.name" placeholder="Luna" required />
          </div>
          <div class="space-y-2">
            <Label>Species</Label>
            <Input
              v-model="form.species"
              placeholder="dog, cat, bird..."
              required
            />
          </div>
          <div class="space-y-2">
            <Label>Breed</Label>
            <Input v-model="form.breed" placeholder="Labrador" />
          </div>
          <div class="space-y-2">
            <Label>Birth Date</Label>
            <Input v-model="form.birthDate" type="date" />
          </div>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Adding..." : "Add Pet" }}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import AppLayout from "@/components/AppLayout.vue";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { petsApi } from "@/api/pets";

const router = useRouter();
const queryClient = useQueryClient();

const showDialog = ref(false);
const loading = ref(false);
const error = ref("");

const form = reactive({
  name: "",
  species: "",
  breed: "",
  birthDate: "",
});

const { data: pets, isLoading } = useQuery({
  queryKey: ["pets"],
  queryFn: () => petsApi.getAll().then((r) => r.data),
});

const { mutate: createPet } = useMutation({
  mutationFn: (data: typeof form) => petsApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["pets"] });
    showDialog.value = false;
    Object.assign(form, { name: "", species: "", breed: "", birthDate: "" });
  },
});

async function handleCreate() {
  loading.value = true;
  error.value = "";
  try {
    createPet(form);
  } catch {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function speciesEmoji(species: string) {
  const map: Record<string, string> = {
    dog: "🐶",
    cat: "🐱",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐰",
  };
  return map[species.toLowerCase()] ?? "🐾";
}
</script>
