import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'recruitpulse_slots'

export const useProcessStore = defineStore('process', () => {
  const interviewerSlots = ref(load())

  function load() { try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : [] } catch { return [] } }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(interviewerSlots.value)) }

  function addSlots(dates, timeRanges) {
    dates.forEach(date => {
      const existing = interviewerSlots.value.find(s => s.date === date)
      if (existing) {
        const merged = new Set([...existing.slots, ...timeRanges])
        existing.slots = [...merged].sort()
      } else {
        interviewerSlots.value.push({ date, slots: [...timeRanges].sort() })
      }
    })
    interviewerSlots.value.sort((a, b) => a.date.localeCompare(b.date))
    save()
  }

  function removeSlot(date, slot) {
    const entry = interviewerSlots.value.find(s => s.date === date)
    if (entry) {
      entry.slots = entry.slots.filter(s => s !== slot)
      if (entry.slots.length === 0) {
        interviewerSlots.value = interviewerSlots.value.filter(s => s.date !== date)
      }
    }
    save()
  }

  function clearSlots() {
    interviewerSlots.value = []
    save()
  }

  function getAllSlots() {
    const result = []
    interviewerSlots.value.forEach(entry => {
      entry.slots.forEach(s => result.push(`${entry.date} ${s}`))
    })
    return result
  }

  watch(interviewerSlots, save, { deep: true })

  return { interviewerSlots, addSlots, removeSlot, clearSlots, getAllSlots }
})
