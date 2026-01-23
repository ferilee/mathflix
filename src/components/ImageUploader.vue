<template>
  <div class="w-full">
    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{{ label }}</label>

    <!-- Tab Navigation -->
    <div class="flex border-b border-gray-300 dark:border-gray-600 mb-4">
      <button
        type="button"
        @click="activeTab = 'url'"
        :class="['px-4 py-2 font-medium text-sm', activeTab === 'url' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        URL Gambar
      </button>
      <button
        type="button"
        @click="activeTab = 'upload'"
        :class="['px-4 py-2 font-medium text-sm', activeTab === 'upload' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        Upload dari Komputer
      </button>
      <button
        type="button"
        @click="activeTab = 'browse'"
        :class="['px-4 py-2 font-medium text-sm', activeTab === 'browse' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        Telusuri Gambar
      </button>
    </div>

    <!-- URL Tab -->
    <div v-if="activeTab === 'url'" class="mb-4">
      <input
        v-model="localValue"
        @blur="validateImageUrl"
        @input="onInput"
        type="url"
        :placeholder="placeholder"
        class="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
      />
      <p class="text-xs text-gray-400 mt-1">{{ urlHelperText }}</p>
    </div>

    <!-- Upload Tab -->
    <div v-if="activeTab === 'upload'" class="mb-4">
      <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @click="triggerFileInput"
        :class="{ 'border-indigo-500 bg-indigo-50/20': isDragging }"
      >
        <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" ref="fileInputRef">
        <div class="flex flex-col items-center justify-center">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">
            Seret & lepas gambar di sini atau klik untuk mencari
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Max 5MB • JPG, PNG, GIF, WEBP
          </p>
        </div>
      </div>

      <div v-if="uploading" class="text-xs text-indigo-600 dark:text-indigo-400 mt-2 flex items-center">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ uploadingText }}
      </div>
    </div>

    <!-- Browse Tab -->
    <div v-if="activeTab === 'browse'" class="mb-4">
      <div class="mb-4">
        <p class="text-xs text-gray-400 mb-2">Dari Storage (MinIO)</p>
        <div v-if="storageLoading" class="text-xs text-gray-500">Memuat gambar...</div>
        <div v-else-if="storageError" class="text-xs text-red-400">{{ storageError }}</div>
        <div v-else-if="storageImages.length === 0" class="text-xs text-gray-500">Belum ada gambar di storage.</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <div
            v-for="(item, index) in storageImages"
            :key="item.key || index"
            class="aspect-square rounded-md overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all"
            @click="selectSample(item.url)"
          >
            <img :src="resolveStorageUrl(item.url)" :alt="item.key" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div
          v-for="(sample, index) in sampleImages"
          :key="index"
          class="aspect-square rounded-md overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all"
          @click="selectSample(sample.url)"
        >
          <img :src="sample.url" :alt="sample.alt" class="w-full h-full object-cover">
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-1">Klik gambar untuk menggunakan sebagai background</p>
    </div>

    <p class="text-xs text-gray-400 mb-4">{{ helperText }}</p>

    <!-- Image Preview -->
    <div v-if="localValue" class="mt-4">
      <p class="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Preview Kartu:</p>
      <div class="w-64 aspect-video rounded-md overflow-hidden relative">
        <img :src="localValue" alt="Preview" class="w-full h-full object-cover" @error="imageError = true">
        <div v-if="imageError" class="absolute inset-0 bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-xs p-4 text-center">
          ❌ {{ errorText }}
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
          <p class="text-white font-bold text-sm">{{ previewTitle || 'Judul Preview' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import api from '../api';
import { resolveStorageUrl } from '../utils/storage';

// Props
interface Props {
  modelValue: string;
  label: string;
  placeholder: string;
  uploadLabel?: string;
  helperText?: string;
  urlHelperText?: string;
  previewTitle?: string;
  uploadingText?: string;
  errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  uploadLabel: 'Upload',
  helperText: 'Gambar akan ditampilkan sebagai background kartu di dashboard siswa.',
  urlHelperText: 'Tempelkan URL gambar langsung (contoh: https://example.com/image.jpg)',
  uploadingText: 'Mengupload...',
  errorText: 'Gagal memuat gambar. Periksa URL.'
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Reactive variables
const localValue = ref(props.modelValue);
const imageError = ref(false);
const uploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const activeTab = ref<'url' | 'upload' | 'browse'>('url'); // Default to URL tab
const isDragging = ref(false);
const storageImages = ref<{ key: string; url: string }[]>([]);
const storageLoading = ref(false);
const storageError = ref('');

// Sample images for browsing tab
const sampleImages = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Portrait photo' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Profile photo' },
  { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Education' },
  { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Business' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', alt: 'Man portrait' },
];

const loadStorageImages = async () => {
  if (storageLoading.value) return;
  storageLoading.value = true;
  storageError.value = '';
  try {
    const { data } = await api.get('/upload/list');
    storageImages.value = Array.isArray(data?.items) ? data.items : [];
  } catch (e: any) {
    console.error('Failed to load storage images', e);
    storageError.value = 'Gagal memuat gambar storage.';
  } finally {
    storageLoading.value = false;
  }
};

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

// Watch for changes in localValue
watch(localValue, (newVal) => {
  emit('update:modelValue', newVal);

  if (newVal && newVal.trim() !== '' && !isValidImageUrl(newVal)) {
    imageError.value = true;
  } else {
    imageError.value = false;
  }
});

watch(activeTab, (tab) => {
  if (tab === 'browse' && storageImages.value.length === 0 && !storageLoading.value) {
    loadStorageImages();
  }
});

// Validate image URL format (lenient: allow CDN URLs without extensions)
const isValidImageUrl = (url: string): boolean => {
  try {
    if (!url) return true; // Allow empty URLs

    const trimmed = url.trim();
    if (trimmed.startsWith('/storage/') || trimmed.startsWith('/uploads/')) {
      return true;
    }
    if (trimmed.startsWith('data:')) {
      return true;
    }

    // Accept any http(s) URL; actual image validity is handled by the preview load
    return /^https?:\/\//i.test(trimmed);
  } catch (e) {
    return false;
  }
};

// Validate URL when it changes
const validateImageUrl = () => {
  if (localValue.value && localValue.value.trim() !== '' && !isValidImageUrl(localValue.value)) {
    nextTick(() => {
      alert('Format URL gambar tidak valid. Pastikan URL diakhiri dengan ekstensi gambar yang valid (jpg, png, gif, dll.)');
      imageError.value = true;
    });
  } else {
    imageError.value = false;
  }
};

// Trigger file input when clicking the drop zone
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// Handle dragging over the drop zone
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

// Handle drag leave
const handleDragLeave = () => {
  isDragging.value = false;
};

// Handle drop event
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }
};

// Process file upload
const processFile = async (file: File) => {
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('File terlalu besar. Maksimal 5MB.');
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('File harus berupa gambar (JPEG, PNG, GIF, etc.).');
    return;
  }

  uploading.value = true;
  imageError.value = false;

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Try server upload first
    const response = await api.post('/upload', formData);

    if (response.data.url) {
      // Update form with uploaded image URL
      localValue.value = response.data.url;
      // Reset any errors if set previously
      imageError.value = false;
      // Switch to URL tab after successful upload
      activeTab.value = 'url';
    } else {
      // Fallback: If server upload fails, try data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        localValue.value = e.target?.result as string;
        alert('Gambar disisipkan langsung (fallback). Server upload gagal.');
        imageError.value = false;
        activeTab.value = 'url';
      };
      reader.readAsDataURL(file);
    }
  } catch (error: any) {
    console.error('Upload error:', error);

    // Try fallback to data URL if server upload fails
    const reader = new FileReader();
    reader.onload = (e) => {
      localValue.value = e.target?.result as string;
      alert('Menggunakan gambar tertanam sebagai fallback karena server upload gagal.');
      imageError.value = false;
      activeTab.value = 'url';
    };
    reader.readAsDataURL(file);
  } finally {
    uploading.value = false;
    // Reset file input
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
};

// Handle image upload from file input
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  await processFile(file);
};

// Select a sample image
const selectSample = (imageUrl: string) => {
  localValue.value = imageUrl;
  imageError.value = false;
  activeTab.value = 'url'; // Switch to URL tab after selection
};

// Emit input event
const onInput = () => {
  emit('update:modelValue', localValue.value);
};

onMounted(() => {
  if (activeTab.value === 'browse') {
    loadStorageImages();
  }
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
