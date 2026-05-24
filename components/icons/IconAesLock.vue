<template>
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" v-bind="$attrs">
    <!-- Shackle -->
    <path d="M15.5 23.5V16a8.5 8.5 0 0117 0v7.5" stroke-width="2"/>
    <!-- Lock body -->
    <rect x="8" y="22.5" width="32" height="22" rx="4" stroke-width="1.5"/>
    <!-- Horizontal reinforcement line -->
    <line x1="8" y1="31" x2="40" y2="31" stroke-width="0.8" stroke-dasharray="2.5 1.5"/>
    <!-- Inner panel -->
    <rect x="14" y="27" width="20" height="13" rx="2.5" stroke-width="1" fill="currentColor" fill-opacity="0.08"/>
    <!-- Keyhole circle -->
    <circle cx="24" cy="32" r="3.5" stroke-width="1.3"/>
    <!-- Keyhole slot -->
    <path d="M22.1 35 L24 39.5 L25.9 35" stroke-width="1.4" stroke-linejoin="round" fill="none"/>
    <!-- Corner rivets -->
    <circle cx="12.5" cy="26" r="1.3" fill="currentColor" stroke="none" opacity="0.7"/>
    <circle cx="35.5" cy="26" r="1.3" fill="currentColor" stroke="none" opacity="0.7"/>
    <circle cx="12.5" cy="42" r="1.3" fill="currentColor" stroke="none" opacity="0.7"/>
    <circle cx="35.5" cy="42" r="1.3" fill="currentColor" stroke="none" opacity="0.7"/>
  </svg>
</template>
