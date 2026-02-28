<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Reminders</h1>
        <Button @click="showDialog = true">Add Reminder</Button>
      </div>

      <div v-if="isLoading" class="text-sm text-neutral-500">Loading...</div>

      <div
        v-else-if="!reminders?.length"
        class="text-center py-12 text-neutral-500"
      >
        No reminders yet. Add your first one!
      </div>

      <Card v-else>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="reminder in reminders"
                :key="reminder._id"
                :class="reminder.done ? 'opacity-50' : ''"
              >
                <TableCell class="font-medium">
                  {{ reminder.petId.name }}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{{ reminder.type }}</Badge>
                </TableCell>
                <TableCell>{{ reminder.description }}</TableCell>
                <TableCell>{{ formatDate(reminder.dueDate) }}</TableCell>
                <TableCell>
                  <Badge :variant="reminder.done ? 'default' : 'outline'">
                    {{ reminder.done ? "done" : "pending" }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Button
                      v-if="!reminder.done"
                      variant="outline"
                      size="sm"
                      @click="handleDone(reminder._id)"
                    >
                      Mark Done
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-red-500 hover:text-red-600"
                      @click="handleDelete(reminder._id)"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="showDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a reminder</DialogTitle>
          <DialogDescription
            >Fill in the details below to add a reminder.</DialogDescription
          >
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleCreate">
          <div class="space-y-2">
            <Label>Pet</Label>
            <select
              v-model="form.petId"
              required
              class="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="" disabled>Select a pet</option>
              <option v-for="pet in pets" :key="pet._id" :value="pet._id">
                {{ pet.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Type</Label>
            <select
              v-model="form.type"
              required
              class="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="" disabled>Select a type</option>
              <option value="vaccine">Vaccine</option>
              <option value="medication">Medication</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>Description</Label>
            <Input
              v-model="form.description"
              placeholder="Annual rabies vaccine"
              required
            />
          </div>
          <div class="space-y-2">
            <Label>Due Date</Label>
            <Input v-model="form.dueDate" type="date" required />
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Adding..." : "Add Reminder" }}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import AppLayout from "@/components/AppLayout.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { remindersApi } from "@/api/reminders";
import { petsApi } from "@/api/pets";

const queryClient = useQueryClient();
const showDialog = ref(false);
const loading = ref(false);

const form = reactive({
  petId: "",
  type: "",
  description: "",
  dueDate: "",
});

const { data: reminders, isLoading } = useQuery({
  queryKey: ["reminders"],
  queryFn: () => remindersApi.getAll().then((r) => r.data),
});

const { data: pets } = useQuery({
  queryKey: ["pets"],
  queryFn: () => petsApi.getAll().then((r) => r.data),
});

const { mutate: createReminder } = useMutation({
  mutationFn: (data: typeof form) => remindersApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reminders"] });
    showDialog.value = false;
    Object.assign(form, { petId: "", type: "", description: "", dueDate: "" });
  },
});

const { mutate: updateReminder } = useMutation({
  mutationFn: ({ id, data }: { id: string; data: object }) =>
    remindersApi.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reminders"] });
  },
});

const { mutate: deleteReminder } = useMutation({
  mutationFn: (id: string) => remindersApi.remove(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["reminders"] });
  },
});

async function handleCreate() {
  loading.value = true;
  try {
    createReminder(form);
  } finally {
    loading.value = false;
  }
}

function handleDone(id: string) {
  updateReminder({ id, data: { done: true } });
}

function handleDelete(id: string) {
  deleteReminder(id);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
