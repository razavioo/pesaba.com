<template>
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" v-bind="$attrs">
    <!-- IC package body -->
    <rect x="12" y="12" width="24" height="24" rx="2" stroke-width="1.5"/>
    <!-- Top pins (5) -->
    <line x1="15.5" y1="12" x2="15.5" y2="7"  stroke-width="1.2"/>
    <line x1="19.5" y1="12" x2="19.5" y2="7"  stroke-width="1.2"/>
    <line x1="24"   y1="12" x2="24"   y2="7"  stroke-width="1.2"/>
    <line x1="28.5" y1="12" x2="28.5" y2="7"  stroke-width="1.2"/>
    <line x1="32.5" y1="12" x2="32.5" y2="7"  stroke-width="1.2"/>
    <!-- Bottom pins (5) -->
    <line x1="15.5" y1="36" x2="15.5" y2="41" stroke-width="1.2"/>
    <line x1="19.5" y1="36" x2="19.5" y2="41" stroke-width="1.2"/>
    <line x1="24"   y1="36" x2="24"   y2="41" stroke-width="1.2"/>
    <line x1="28.5" y1="36" x2="28.5" y2="41" stroke-width="1.2"/>
    <line x1="32.5" y1="36" x2="32.5" y2="41" stroke-width="1.2"/>
    <!-- Left pins (5) -->
    <line x1="12" y1="15.5" x2="7"  y2="15.5" stroke-width="1.2"/>
    <line x1="12" y1="19.5" x2="7"  y2="19.5" stroke-width="1.2"/>
    <line x1="12" y1="24"   x2="7"  y2="24"   stroke-width="1.2"/>
    <line x1="12" y1="28.5" x2="7"  y2="28.5" stroke-width="1.2"/>
    <line x1="12" y1="32.5" x2="7"  y2="32.5" stroke-width="1.2"/>
    <!-- Right pins (5) -->
    <line x1="36" y1="15.5" x2="41" y2="15.5" stroke-width="1.2"/>
    <line x1="36" y1="19.5" x2="41" y2="19.5" stroke-width="1.2"/>
    <line x1="36" y1="24"   x2="41" y2="24"   stroke-width="1.2"/>
    <line x1="36" y1="28.5" x2="41" y2="28.5" stroke-width="1.2"/>
    <line x1="36" y1="32.5" x2="41" y2="32.5" stroke-width="1.2"/>
    <!-- 3×3 logic cell array -->
    <rect x="14" y="14" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.22"/>
    <rect x="21" y="14" width="6" height="6" rx="0.5" stroke-width="1"/>
    <rect x="28" y="14" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.12"/>
    <rect x="14" y="21" width="6" height="6" rx="0.5" stroke-width="1"/>
    <rect x="21" y="21" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.28"/>
    <rect x="28" y="21" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.12"/>
    <rect x="14" y="28" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.12"/>
    <rect x="21" y="28" width="6" height="6" rx="0.5" stroke-width="1"   fill="currentColor" fill-opacity="0.22"/>
    <rect x="28" y="28" width="6" height="6" rx="0.5" stroke-width="1"/>
    <!-- Internal routing traces -->
    <path d="M20 17 L24 17 M24 17 L28 21 M20 24 L28 24 M20 31 L24 31 M24 31 L28 28" stroke-width="0.7" opacity="0.55"/>
    <!-- Pin-1 corner dot -->
    <circle cx="13.5" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
</template>
