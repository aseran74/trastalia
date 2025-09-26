<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/dashboard">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden h-16 w-auto sm:h-18 lg:h-20"
          src="/images/Trastalia3.png"
          alt="Logo"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block h-16 w-auto sm:h-18 lg:h-20"
          src="/images/Trastalia3.png"
          alt="Logo"
        />
        <img
          v-else
          src="/images/Trastalia3.png"
          alt="Logo"
          class="h-12 w-auto"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in filteredMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import ShoppingCartIcon from "@/icons/ShoppingCartIcon.vue";
import SellIcon from "@/icons/SellIcon.vue";
import CoinsIcon from "@/icons/CoinsIcon.vue";
import CurrencyEuroIcon from "@/icons/CurrencyEuroIcon.vue";
import RequestIcon from "@/icons/RequestIcon.vue";
import WarehouseIcon from "@/icons/WarehouseIcon.vue";
import MyItemsIcon from "@/icons/MyItemsIcon.vue";
import PurchaseIcon from "@/icons/PurchaseIcon.vue";
import ExchangeIcon from "@/icons/ExchangeIcon.vue";
import SoldIcon from "@/icons/SoldIcon.vue";
import AdminIcon from "@/icons/AdminIcon.vue";
import ManageIcon from "@/icons/ManageIcon.vue";
import LogisticsIcon from "@/icons/LogisticsIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

// Filtrar elementos del menú basado en el rol del usuario
const filteredMenuGroups = computed(() => {
  return menuGroups.map(group => {
    if (group.title === "Administración") {
      // Solo mostrar administración si el usuario es admin
      if (authStore.user?.role !== 'admin') {
        return { ...group, items: [] };
      }
    }
    return group;
  }).filter(group => group.items.length > 0);
});

const menuGroups = [
  {
    title: "Dashboard",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/",
      },
    ],
  },
  {
    title: "Plataforma de Compraventa",
    items: [
      {
        icon: ShoppingCartIcon,
        name: "Comprar Artículos",
        path: "/comprar-articulos",
      },
      {
        icon: SellIcon,
        name: "Vender Artículo",
        path: "/vender-articulo-nuevo",
      },
      {
        icon: CoinsIcon,
        name: "Mis Puntos",
        path: "/mis-transacciones-puntos",
      },
      {
        icon: RequestIcon,
        name: "Solicitudes de Compra",
        path: "/mis-solicitudes-compra",
      },
    ],
  },
  {
    title: "Mis Actividades",
    items: [
      {
        icon: MyItemsIcon,
        name: "Mis Artículos",
        path: "/mis-articulos",
      },
      {
        icon: PurchaseIcon,
        name: "Mis Compras",
        path: "/mis-compras",
      },
      {
        icon: ExchangeIcon,
        name: "Mis Canjes",
        path: "/mis-intercambios",
      },
      {
        icon: SoldIcon,
        name: "Artículos Vendidos",
        path: "/articulos-vendidos",
      },
    ],
  },
  {
    title: "Perfil",
    items: [
      {
        icon: UserCircleIcon,
        name: "Mi Perfil",
        path: "/profile",
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        icon: AdminIcon,
        name: "Panel Admin",
        path: "/admin",
      },
      {
        icon: ManageIcon,
        name: "Editar Artículos",
        path: "/admin/articles-management",
      },
      {
        icon: RequestIcon,
        name: "Solicitudes de Compra",
        path: "/admin/purchase-requests",
      },
      {
        icon: ManageIcon,
        name: "Gestionar Artículos",
        path: "/admin/articulos",
      },
      {
        icon: PieChartIcon,
        name: "Pendientes Valoración",
        path: "/admin/articulos/pendientes-valoracion",
      },
      {
        icon: LogisticsIcon,
        name: "Centros Logísticos",
        path: "/centros-logisticos",
      },
    ],
  },
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return filteredMenuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      filteredMenuGroups.value[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
