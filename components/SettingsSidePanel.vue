<script setup lang="ts">
import {
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  AtSymbolIcon,
  GlobeAltIcon,
  Cog8ToothIcon,
  UsersIcon,
  ArrowUpCircleIcon,
  CursorArrowRaysIcon,
  KeyIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuth();

const props = defineProps<{
  selectedIndex: number;
}>();
const emit = defineEmits<{
  select: [index: number];
}>();

const userFirstLetter = computed(() => {
  return (
    authStore.user.value?.displayName?.charAt(0).toUpperCase() ||
    authStore.user.value?.email?.charAt(0).toUpperCase() ||
    "U"
  );
});
</script>

<template>
  <div
    class="absolute bottom-0 left-0 top-0 flex w-64 flex-col rounded-l-xl bg-slate-50 px-0.5 py-3"
  >
    <p class="ml-3 text-sm font-medium text-gray-400">Account</p>

    <div class="ml-3 flex items-center">
      <div v-if="authStore.user.value?.hasPhoto"></div>
      <div
        class="flex size-5 items-center justify-center rounded-full bg-white text-xs text-gray-500 shadow-sm"
        v-else
      >
        {{ userFirstLetter }}
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-700">
          {{ authStore.user.value?.displayName }}
        </p>
        <p class="text-xs font-normal text-gray-400">
          {{ authStore.user.value?.email }}
        </p>
      </div>
    </div>
    <div class="font-normal text-gray-700">
      <DefaultPanelItem
        title="My Account"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 0"
        @click="emit('select', 0)"
      >
        <UserCircleIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Settings"
        class="mb-0.5 w-full pl-3"
        :selected="selectedIndex === 1"
        @click="emit('select', 1)"
      >
        <AdjustmentsHorizontalIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Notifications"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 2"
        @click="emit('select', 2)"
      >
        <BellIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Connections"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 3"
        @click="emit('select', 3)"
      >
        <AtSymbolIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="My Workspaces"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 4"
        @click="emit('select', 4)"
      >
        <GlobeAltIcon class="size-5" />
      </DefaultPanelItem>
    </div>
    <p class="mb-1 ml-3 text-sm font-medium text-gray-400">Workspace</p>
    <div class="font-normal text-gray-700">
      <DefaultPanelItem
        title="Settings"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 5"
        @click="emit('select', 5)"
      >
        <Cog8ToothIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="People"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 6"
        @click="emit('select', 6)"
      >
        <UsersIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Upgrade"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 7"
        @click="emit('select', 7)"
      >
        <ArrowUpCircleIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Sites"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 8"
        @click="emit('select', 8)"
      >
        <CursorArrowRaysIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Security"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 9"
        @click="emit('select', 9)"
      >
        <KeyIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Identity & provisioning"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 10"
        @click="emit('select', 10)"
      >
        <ShieldCheckIcon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Connections"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 11"
        @click="emit('select', 11)"
      >
        <Squares2X2Icon class="size-5" />
      </DefaultPanelItem>
      <DefaultPanelItem
        title="Import"
        class="mb-0.5 w-full pl-3"
        :selected="props.selectedIndex === 12"
        @click="emit('select', 12)"
      >
        <ArrowDownTrayIcon class="size-5" />
      </DefaultPanelItem>
    </div>
  </div>
</template>
