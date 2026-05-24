<template>
  <div class="layout-glossary flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
    <div class="fixed inset-0 pointer-events-none bg-graph-paper" aria-hidden="true" />
    <AppHeader />
    <main id="main-content" class="flex-1 relative z-10 pt-20">
      <slot />
    </main>
    <AppFooter />

  </div>
</template>
