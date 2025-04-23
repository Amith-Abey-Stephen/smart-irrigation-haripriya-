<template>
  <usernav></usernav>

  <div class="ml-[16rem]">
    <p class="text-3xl p-2 text-gray-900">Schedule Irrigation...</p>
    <p class="text-xl pl-2">Pick a date, time, and duration to schedule irrigation</p>
  </div>

  <div class="min-h-screen flex flex-col items-center justify-start bg-white p-6">
    <div class="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-6 space-y-4 text-white">
      <h2 class="text-2xl font-semibold text-center">📅 Pick a Date & Time</h2>

      <!-- Date and Time Picker -->
      <input
        type="datetime-local"
        v-model="dateTime"
        class="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <!-- Duration Dropdown -->
      <div class="w-full">
        <label for="duration" class="block text-sm">Select Duration:</label>
        <select
          v-model="duration"
          id="duration"
          class="w-full p-2 mt-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="1">1 minute</option>
          <option value="2">2 minutes</option>
          <option value="5">5 minutes</option>
          <option value="other">Other...</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button
        @click="submitSchedule"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-sm"
      >
        Submit
      </button>

      <!-- Display selected date and time -->
      <div v-if="dateTime" class="text-gray-300 text-center pt-2">
        Selected: 
        <span class="text-blue-400 font-medium">{{ formattedDateTime }}</span>
      </div>

      <!-- LED Indicator -->
      <div class="flex items-center justify-center mt-4">
        <span class="text-sm font-medium">System Status:</span>
        <div :class="isSystemOn ? 'bg-green-500' : 'bg-red-500'" class="ml-2 w-4 h-4 rounded-full"></div>
      </div>
    </div>

    <!-- Scheduled Irrigations Table -->
    <div class="w-full max-w-2xl mt-10 bg-gray-900 rounded-xl shadow p-4 text-white">
      <h3 class="text-xl font-semibold mb-4">📋 Scheduled Irrigations</h3>
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="text-left text-gray-300 border-b border-gray-600">
            <th class="p-2">#</th>
            <th class="p-2">Date & Time</th>
            <th class="p-2">Duration</th>
            <th class="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, index) in schedules"
            :key="entry.id"
            class="border-b border-gray-700"
          >
            <td class="p-2">{{ index + 1 }}</td>
            <td class="p-2">{{ new Date(entry.epoch).toLocaleString() }}</td>
            <td class="p-2">{{ entry.duration / 60 }} minutes</td>
            <td class="p-2">
              <button
                @click="removeSchedule(entry.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import usernav from '../components/usernav.vue';
import { ref, onMounted, computed } from 'vue'
import { db } from '../store/firebase' // adjust path to your firebase config
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'


export default{
  name: 'user_sched',
  components: {
     usernav
  },
  setup() {
    const dateTime = ref('')
    const duration = ref('1') // Default duration is 1 minute
    const schedules = ref([])
    const isSystemOn = ref(false) // Add a reactive property for system status

    // Computed property to format the selected datetime
    const formattedDateTime = computed(() => {
      return dateTime.value ? new Date(dateTime.value).toLocaleString() : '0'
    })

    // Function to handle the submission of the schedule
    const submitSchedule = async () => {
      if (!dateTime.value) return alert('Please select a date and time.')
      if (duration.value === 'other') return alert('Please specify a custom duration.')

      // Ensure the date-time is valid
      const cleanedDateTime = dateTime.value.includes(':') && dateTime.value.length === 16 ? `${dateTime.value}:00` : dateTime.value
      const epoch = Math.floor(new Date(cleanedDateTime).getTime()) // Convert date to epoch timestamp

      try {
        // Add the new schedule to Firestore
        await addDoc(collection(db, 'irrigation_schedule'), {
          epoch,
          duration: parseInt(duration.value) * 60, // Convert duration to seconds
        })

        // Fetch updated schedule list
        await fetchSchedules()
        
        // Reset the input values
        dateTime.value = ''
        duration.value = '1' // Reset to default duration
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    // Function to fetch schedules from Firestore
    const fetchSchedules = async () => {
      const snapshot = await getDocs(collection(db, 'irrigation_schedule'))
      schedules.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }

    // Function to remove a schedule from Firestore
    const removeSchedule = async (id) => {
      try {
        await deleteDoc(doc(db, 'irrigation_schedule', id))
        schedules.value = schedules.value.filter(entry => entry.id !== id)
      } catch (e) {
        console.error('Error deleting document:', e)
      }
    }

    // Function to fetch system status from Firestore
    const fetchSystemStatus = async () => {
      try {
        const docRef = doc(db, 'toggleStatus', 'mainToggle')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          isSystemOn.value = docSnap.data().status
        }
      } catch (error) {
        console.error('Error fetching system status:', error)
      }
    }

    // Fetch schedules and system status when the component is mounted
    onMounted(() => {
      fetchSchedules()
      fetchSystemStatus()
    })

    return {
      dateTime,
      duration,
      schedules,
      formattedDateTime,
      submitSchedule,
      removeSchedule,
      isSystemOn
    }
  }
}
</script>