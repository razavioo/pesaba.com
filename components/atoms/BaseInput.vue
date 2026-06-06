<template>
  <div class="relative">
    <label v-if="label" :for="id" class="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
      {{ label }}
      <span v-if="required" class="text-critical-500 ms-0.5" aria-hidden="true">*</span>
    </label>
    <component
      :is="multiline ? 'textarea' : 'input'"
      :id="id"
      :name="name"
      :type="multiline ? undefined : type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :rows="multiline ? rows : undefined"
      :class="inputClass"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
    />
    <p v-if="error" class="mt-1 text-xs text-critical-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string
  id?: string
  name?: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  multiline?: boolean
  rows?: number
  error?: string
}>(), {
  type: 'text',
  rows: 4,
  multiline: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
}>()

const inputClass = computed(() => [
  'w-full bg-[var(--bg-elevated)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-md',
  'px-3.5 py-2.5 text-sm leading-6',
  'transition-colors duration-150 ease-hover',
  'outline-none',
  props.error
    ? 'border-critical-500 focus:border-critical-500 focus:ring-1 focus:ring-critical-500/30'
    : 'border-[var(--border)] focus:border-photon-500/60 focus:ring-1 focus:ring-photon-500/20',
  props.disabled ? 'opacity-50 cursor-not-allowed' : '',
  props.readonly ? 'opacity-80 cursor-default' : '',
  props.multiline ? 'resize-y min-h-24' : '',
])
</script>
