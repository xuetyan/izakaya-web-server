<template>
  <div class="upload"></div>
</template>

<script lang="ts" setup name="UploadImage">
interface Prop {

}

withDefaults(defineProps<Prop>(), {})
defineEmits<{}>()
</script>

<style scoped>
.upload {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: url('../assets/iconImage/upload.png') no-repeat center/70%;
    background-color: rgb(255, 132, 236);
    opacity: 0.5;
    cursor: pointer;
}
</style>