<script setup lang="ts">
// Type pour propriétés
type PropsType = {
  title: string;
  option: string;
  img: string;
  modelValue: string;
};

// Definitions des Evenements du composant
const emit = defineEmits(["update:modelValue"]);

// Definitions des propriété du composant
const props = defineProps<PropsType>();

const handleClick = () => {
  console.log("value =>",props.option);
  emit("update:modelValue", props.option);
};
</script>

<template>
  <div
    v-if="!(modelValue == option)"
    @click="handleClick"
    class="box-part w-100 rounded-lg bg-surface d-flex justify-start align-center ga-3 ps-2 py-3 mb-4"
  >
    <img class="" width="55" :src="img" :alt="img" />
    <p class="par">{{ title }}</p>
  </div>

  <div
    v-if="modelValue == option"
    @click="handleClick"
    class="box-part active w-100 rounded-lg bg-surface d-flex justify-start align-center ga-3 ps-2 py-3 mb-4"
  >
    <img class="" width="55" :src="img" :alt="img" />
    <p class="par">{{ title }}</p>
  </div>
</template>

<style scoped>
.par {
  font-size: 1.1rem;
  width: 60%;
  text-align: left;
}

.box-part {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.075) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.box-part:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.box-part.active {
  background: rgba(255, 107, 157, 0.075) !important;
  border: 1px solid rgba(255, 107, 157, 0.6);
}

.box-part.active:hover {
  background: rgba(255, 107, 157, 0.1) !important;
  border: 1px solid rgba(255, 107, 157, 0.6);
}
</style>
