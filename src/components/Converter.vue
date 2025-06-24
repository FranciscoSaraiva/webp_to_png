<template>
  <div>
    <div
      id="dropArea"
      @dragover.prevent
      @dragleave.prevent
      @drop.prevent="handleDrop"
      @click="() => fileInput?.click()"
    >
      <p>Drag & drop WebP images here or click to select</p>
    </div>
    <input type="file" accept="image/webp" multiple ref="fileInput" style="display: none" @change="handleFiles" />

    <div class="previews">
      <div v-for="(img, index) in previews" :key="index" class="preview">
        <img :src="img.url" :alt="img.name" />
        <a :href="img.url" :download="img.name">Download {{ img.name }}</a>
      </div>
    </div>

    <button v-if="previews.length" @click="downloadAll">Download All as ZIP</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JSZip from 'jszip';

interface ConvertedImage {
  name: string;
  blob: Blob;
  url: string;
}

const previews = ref<ConvertedImage[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    processFiles(input.files);
  }
};

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files) {
    processFiles(e.dataTransfer.files);
  }
};

const processFiles = async (files: FileList) => {
  previews.value = []; // reset
  for (const file of Array.from(files)) {
    if (file.type !== 'image/webp') continue;

    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'));
    const url = URL.createObjectURL(blob);
    previews.value.push({ name: file.name.replace('.webp', '.png'), blob, url });
  }
};

const downloadAll = async () => {
  const zip = new JSZip();
  for (const item of previews.value) {
    zip.file(item.name, item.blob);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = 'converted_pngs.zip';
  a.click();
};
</script>

<style scoped>
#dropArea {
  border: 2px dashed #ccc;
  padding: 2rem;
  border-radius: 10px;
  margin: 1rem 0;
  cursor: pointer;
}
.previews {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.preview {
  text-align: center;
}
.preview img {
  width: 100px;
  height: auto;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
