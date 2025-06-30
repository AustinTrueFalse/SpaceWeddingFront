<template>
  <DialogDefault
    v-if="dialogStore.type === 'changeAvatar'"
    title="Добавление гостя"
    confirmText="Да"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        grid-gap: 50px;
      "
    >
      <avatar-editor
        :width="400"
        :height="400"
        :border="0"
        :borderRadius="180"
        ref="avatarEditorRef"
        @image-ready="onImageReady"
        v-model:scale="scaleVal"
      />
      <input
        type="range"
        :min="scaleMin"
        :max="scaleMax"
        :step="scaleStep"
        v-model="scaleVal"
      />
      <button @click="save">Save</button>
    </div>
  </DialogDefault>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { AvatarEditor } from "avatar-editor";
import "avatar-editor/dist/style.css";
import { useDialogStore } from "@/stores/dialog";
import DialogDefault from "@/components/template/DialogDefault.vue";
import "avatar-editor/dist/style.css";

const dialogStore = useDialogStore();

const scaleVal = ref<number>(1);
const scaleStep = 0.02;
const scaleMin = 1;
const scaleMax = 3;

const avatarEditorRef = ref<any>(null);

const onImageReady = (scale: number) => {
  scaleVal.value = scale;
};

const handleWheelEvent = (e: WheelEvent) => {
  if (e.deltaY > 0 && scaleVal.value - scaleStep >= scaleMin) {
    // Down
    scaleVal.value -= scaleStep;
  } else {
    // Up
    if (scaleVal.value + scaleStep <= scaleMax) {
      scaleVal.value += scaleStep;
    }
  }
};

const save = () => {
  if (avatarEditorRef.value) {
    const canvasData = avatarEditorRef.value.getImageScaled();
    const img = canvasData.toDataURL("image/png");
    console.log(img);
  }
};

onMounted(() => {
  document.addEventListener("wheel", handleWheelEvent);
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleWheelEvent);
});
</script>
