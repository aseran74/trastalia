<template>
  <div
    class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
  >
    <div class="mb-3 flex justify-center">
      <img src="/images/Trastalia3.png" alt="Trastalia" class="h-16 w-auto" />
    </div>
    <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Trastalia</h3>
    <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
      Ha llegado una nueva manera de vender artículos de segunda mano
    </p>
    <router-link
      to="/vender-articulo"
      class="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-primary text-theme-sm hover:bg-primary/90"
    >
      Publicar Artículo
    </router-link>
  </div>
</template>
