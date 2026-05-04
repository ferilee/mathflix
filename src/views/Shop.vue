<template>
  <div class="max-w-5xl mx-auto p-4 md:p-6 text-white min-h-[80vh]">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
       <h1 class="text-4xl md:text-5xl font-extrabold text-[#fb923c] uppercase tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]" style="-webkit-text-stroke: 1px #9a3412;">
          🛒 The Merchant
       </h1>
       <div class="mt-4 md:mt-0 bg-slate-900 border-4 border-emerald-500 rounded-full px-6 py-2 shadow-[0_4px_0_#047857] flex items-center gap-3">
          <span class="text-3xl filter drop-shadow-md">⚡</span>
          <div class="flex flex-col">
             <span class="text-xs font-black text-emerald-400 uppercase tracking-widest">Your AP</span>
             <span class="text-2xl font-black text-white" style="-webkit-text-stroke: 1px #047857;">{{ studentAP }} AP</span>
          </div>
       </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-8">
       <button @click="activeTab = 'shop'" :class="activeTab === 'shop' ? 'bg-orange-500 border-orange-700 shadow-[0_6px_0_#c2410c] text-white translate-y-0' : 'bg-slate-700 border-slate-900 shadow-[0_6px_0_#0f172a] text-slate-400 translate-y-1'" class="flex-1 py-3 px-6 rounded-2xl border-b-[6px] font-black uppercase tracking-widest text-xl transition-all">
          Store
       </button>
       <button @click="activeTab = 'inventory'" :class="activeTab === 'inventory' ? 'bg-purple-500 border-purple-700 shadow-[0_6px_0_#7e22ce] text-white translate-y-0' : 'bg-slate-700 border-slate-900 shadow-[0_6px_0_#0f172a] text-slate-400 translate-y-1'" class="flex-1 py-3 px-6 rounded-2xl border-b-[6px] font-black uppercase tracking-widest text-xl transition-all">
          My Items
       </button>
    </div>

    <!-- Store Tab -->
    <div v-if="activeTab === 'shop'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <div v-for="item in items" :key="item.id" class="bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2rem] border-t-4 border-white/10 border-b-[8px] border-slate-950 p-6 flex flex-col items-center text-center shadow-xl transform transition hover:-translate-y-1 relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-1/3 bg-white/5 rounded-t-[2rem] blur-[1px]"></div>
          
          <div class="text-7xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-4 relative z-10">{{ item.icon || '📦' }}</div>
          <h2 class="text-2xl font-black text-white mb-2 relative z-10" style="-webkit-text-stroke: 1px #334155;">{{ item.name }}</h2>
          <p class="text-sm text-slate-400 font-bold mb-6 flex-1 relative z-10">{{ item.description }}</p>
          
          <button @click="buyItem(item)" :disabled="studentAP < item.ap_cost" :class="studentAP >= item.ap_cost ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 shadow-[0_6px_0_#047857]' : 'bg-slate-700 border-slate-800 shadow-[0_6px_0_#0f172a] opacity-50 cursor-not-allowed'" class="w-full py-3 rounded-2xl border-b-[6px] font-black text-xl text-white uppercase tracking-widest transition-all active:translate-y-2 active:shadow-none flex justify-center items-center gap-2 relative z-10">
             <span>{{ item.ap_cost }} AP</span>
             <span v-if="studentAP >= item.ap_cost">Buy</span>
             <span v-else>Locked</span>
          </button>
       </div>
    </div>

    <!-- Inventory Tab -->
    <div v-if="activeTab === 'inventory'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div v-if="inventory.length === 0" class="col-span-full py-20 text-center">
          <span class="text-6xl drop-shadow-md mb-4 block">🕸️</span>
          <h2 class="text-2xl font-black text-slate-500 uppercase tracking-widest">Your bag is empty</h2>
       </div>

       <div v-for="inv in inventory" :key="inv.id" class="bg-gradient-to-r from-purple-900 to-slate-900 rounded-[2rem] border-4 border-purple-500/50 shadow-lg p-4 flex items-center gap-6 relative overflow-hidden">
          <div class="w-20 h-20 rounded-2xl bg-black/50 border-2 border-purple-500/30 flex items-center justify-center text-5xl shadow-inner shrink-0 relative z-10">
             {{ inv.icon || '📦' }}
          </div>
          <div class="flex-1 relative z-10">
             <h3 class="text-xl font-black text-white" style="-webkit-text-stroke: 1px #581c87;">{{ inv.name }}</h3>
             <p class="text-xs text-purple-300 font-bold mb-3 line-clamp-1">{{ inv.description }}</p>
             <button v-if="!inv.is_used" @click="useItem(inv)" class="bg-pink-500 hover:bg-pink-400 border-b-4 border-pink-700 text-white font-black text-sm px-6 py-2 rounded-xl shadow-[0_4px_0_#be185d] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest">
                Use Item
             </button>
             <span v-else class="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-md">Used</span>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import billingApi from '../api/billing';
import api from '../api';
import { useDialog } from '../utils/dialog';

const items = ref<any[]>([]);
const inventory = ref<any[]>([]);
const activeTab = ref<'shop' | 'inventory'>('shop');
const studentAP = ref(0);
const studentId = ref('');
const dialog = useDialog();

const loadStudent = async () => {
  const saved = localStorage.getItem('student');
  if (saved) {
    const student = JSON.parse(saved);
    studentId.value = student.id;
    // Get fresh AP from API
    try {
      const { data } = await api.get(`/students/${student.id}`);
      if (data && data.ap !== undefined) {
         studentAP.value = data.ap;
      }
    } catch {
       studentAP.value = student.ap || 0;
    }
  }
};

const loadItems = async () => {
  try {
    const res = await billingApi.get('/billing/shop/items');
    items.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const loadInventory = async () => {
  if (!studentId.value) return;
  try {
    const res = await billingApi.get('/billing/shop/inventory', { params: { student_id: studentId.value }});
    inventory.value = res.data;
  } catch (e) {
    console.error(e);
  }
};

const buyItem = async (item: any) => {
  const confirm = await dialog.confirm(`Buy ${item.name} for ${item.ap_cost} AP?`, 'Buy Item');
  if (!confirm) return;

  try {
    const res = await billingApi.post('/billing/shop/buy', {
       student_id: studentId.value,
       item_id: item.id
    });
    if (res.data.status === 'ok') {
       studentAP.value = res.data.remaining_ap;
       await dialog.alert('Item purchased successfully! Check your My Items tab.', 'Success');
       loadInventory();
       
       const saved = localStorage.getItem('student');
       if (saved) {
         const student = JSON.parse(saved);
         student.ap = studentAP.value;
         localStorage.setItem('student', JSON.stringify(student));
         window.dispatchEvent(new Event('student-updated'));
       }
    }
  } catch (e: any) {
    dialog.alert(e?.response?.data?.error || 'Failed to buy item.', 'Error');
  }
};

const useItem = async (inv: any) => {
  const confirm = await dialog.confirm(`Are you sure you want to use ${inv.name}?`, 'Use Item');
  if (!confirm) return;

  try {
    const res = await billingApi.post('/billing/shop/use', {
       inventory_id: inv.id,
       student_id: studentId.value
    });
    if (res.data.status === 'ok') {
       await dialog.alert(inv.name + ' used! ' + (res.data.message || ''), 'Item Consumed');
       loadInventory();
       
       if (inv.name.toLowerCase().includes('potion') || inv.name.toLowerCase().includes('healing')) {
          const saved = localStorage.getItem('student');
          if (saved) {
            const student = JSON.parse(saved);
            student.hp = 100;
            student.status = 'active';
            localStorage.setItem('student', JSON.stringify(student));
            window.dispatchEvent(new Event('student-updated'));
          }
       }
    }
  } catch (e: any) {
    dialog.alert(e?.response?.data?.error || 'Failed to use item.', 'Error');
  }
};

onMounted(async () => {
  await loadStudent();
  loadItems();
  loadInventory();
});
</script>
