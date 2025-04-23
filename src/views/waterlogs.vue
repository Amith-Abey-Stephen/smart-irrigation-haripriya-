<template>
    <navigation></navigation>

    <div class="ml-[17rem] pr-3 pt-3 relative overflow-x-auto shadow-md  sm:rounded-lg">
        <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div class="flex w-full justify-between ">   
                <!-- filter dropdown -->
                <div>
                    <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" @click="filterDate"
                        class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        type="button">

                        <svg class="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                        </svg>

                        {{ filterPeriod }}
                        <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>

                    <div id="dropdownRadio" class="absolute top-8 left-0 z-10 hidden w-48 divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-blue-600">   
                        <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                            <li id="dropdownList" v-for="(period, index) in filterPeriods" :key="index ">
                                <div class="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 ">
                                    <input :id="'filter-radio-' + index" type="radio" :value="period" v-model="filterPeriod" name="filter-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" @change="fetchSoilMoistureData">
                                    <label @click="filterDate" :for="'filter-radio-' + index" class="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">{{ period }}</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- toggle on/off -->
                <label class="inline-flex items-center me-5 cursor-pointer">
                    <input type="checkbox" v-model="isChecked" class="sr-only peer" @change="updateStatus()">
                    <div class="relative w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 dark:peer-checked:bg-red-600">
                    </div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-900">{{ isChecked ? 'On' : 'Off' }}</span>
                </label>

                <!-- LED Indicator -->
                <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-900">System Status:</span>
                    <div :class="isChecked ? 'bg-green-500' : 'bg-red-500'" class="ml-2 w-4 h-4 rounded-full"></div>
                </div>
                
            </div>


            <div v-if="loading" class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="ml-2">Loading data...</span>
            </div>
            <div v-if="debugInfo" class="text-sm bg-yellow-100 p-2 rounded text-gray-700 mb-2">
                <p><strong>Debug Info:</strong></p>
                <p>Query Period: {{ filterPeriod }}</p>
                <p>Start Date: {{ debugDate }}</p>
                <p>Collection: soilMoisureData</p>
                <p>Documents Found: {{ soilMoistureData.length }}</p>
                <button @click="fetchAllData" class="bg-blue-500 text-white px-2 py-1 rounded mt-1 text-xs">Try Fetching
                    All Data</button>
            </div>
        </div>

        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">Device ID</th>
                    <th scope="col" class="px-6 py-3">Moisture Level</th>
                    <th scope="col" class="px-6 py-3">Timestamp</th>
                    <th scope="col" class="px-6 py-3">Status</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in soilMoistureData" :key="index"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {{ data.deviceId || 'Unknown' }}
                    </th>
                    <td class="px-6 py-4">
                        {{ data.moisture }}
                    </td>
                    <td class="px-6 py-4">
                        {{ formatTimestamp(data.timestamp) }}
                    </td>
                    <td class="px-6 py-4">
                        <span :class="getMoistureStatusClass(data.moisture)">
                            {{ getMoistureStatus(data.moisture) }}
                        </span>
                    </td>

                </tr>
                <tr v-if="soilMoistureData.length === 0 && !loading" class="bg-white dark:bg-gray-800">
                    <td colspan="5" class="px-6 py-4 text-center">
                        No data available for the selected period.
                        <p v-if="!debugInfo" class="mt-2">
                            <button @click="debugInfo = true" class="text-blue-500 underline">Show Debug Info</button>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import navigation from '../components/navigation.vue';
import { collection, query, getDocs, where, orderBy, limit, Timestamp, doc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../store/firebase';

export default {
    name: 'waterlogs',
    components: {
        navigation
    },
    data() {
        return {
            soilMoistureData: [],
            loading: false,
            filterPeriods: ['Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'],
            filterPeriod: 'Last 30 days',
            debugInfo: false,
            debugDate: null,
            isChecked: false
        };
    },
    mounted() {
        this.testFirestore();
    },
    methods: {

        async testFirestore() {
            try {
                console.log("Testing Firestore connection...");
                const testCollection = collection(db, 'soilMoistureData');
                const testSnapshot = await getDocs(testCollection);
                console.log(`Found ${testSnapshot.docs.length} documents`);
                const testDoc = testSnapshot.docs
                testDoc.forEach(doc => {
                    this.soilMoistureData.push(doc.data());
                });

            } catch (error) {
                console.error("Firestore test error:", error);
            }
        },

        async fetchSoilMoistureData() {
            this.loading = true;

            try {
                const startDate = this.calculateStartDate();
                console.log("Calculated start date:", startDate);

                this.debugDate = startDate.toDate(); // For debugging

                const soilMoistureRef = collection(db, "soilMoistureData");
                const q = query(
                    soilMoistureRef,
                    where("timestamp", ">=", Timestamp.fromMillis(startDate.getTime())), // Ensure correct timestamp format
                    orderBy("timestamp", "desc")
                );

                const querySnapshot = await getDocs(q);
                console.log(`Query returned ${querySnapshot.docs.length} documents`);

                this.soilMoistureData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        deviceId: data.deviceId,
                        moisture: data.moisture,
                        timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JavaScript Date
                    };
                });

                if (querySnapshot.docs.length === 0) {
                    console.log("No data found for the selected period.");
                }
            } catch (error) {
                console.error("Error fetching soil moisture data:", error);
                this.debugInfo = true;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllData() {
            this.loading = true;
            try {
                console.log("Fetching all data without filters");
                const soilMoistureRef = collection(db, 'soilMoistureData');

                // Query without date filters to see if any data exists
                const q = query(soilMoistureRef, limit(100));
                const querySnapshot = await getDocs(q);
                
                console.log(`Query returned ${querySnapshot.docs.length} documents`);

                this.soilMoistureData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log("Document data without filters:", data);
                    return {
                        id: doc.id,
                        deviceId: data.deviceId ,
                        moistureLevel: data.moisture,
                        timestamp: date,
                    };
                });

                if (querySnapshot.docs.length === 0) {
                    console.log("No data found in the collection at all!");
                }
            } catch (error) {
                console.error("Error fetching all soil moisture data:", error);
            } finally {
                this.loading = false;
            }
        },

        filterDate() {
            const dropdownMenu = document.getElementById('dropdownRadio');
            dropdownMenu.classList.toggle('hidden');
        },
        
        calculateStartDate() {
            const now = new Date();
            let startDate = new Date();

            switch (this.filterPeriod) {
                case 'Last day':
                    startDate.setDate(now.getDate() - 1);
                    break;
                case 'Last 7 days':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'Last 30 days':
                    startDate.setDate(now.getDate() - 30);
                    break;
                case 'Last month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case 'Last year':
                    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                default:
                    startDate.setDate(now.getDate() - 30);
            }
            
            return Timestamp.fromDate(startDate);
        },

        formatTimestamp(timestamp) {
            if (!timestamp) return 'Unknown';

            // Check if the timestamp is in seconds or milliseconds
            const isSeconds = timestamp.toString().length === 10; // 10 digits for seconds
            const date = new Date(isSeconds ? timestamp * 1000 : timestamp); // Convert to milliseconds if in seconds
            // Format the date with explicit options for AM/PM
            return date.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Ensures AM/PM format
            });
        },

        getMoistureStatus(level) {
            
            if (level === undefined || level === null) return 'Unknown';

            if (level > 1600) return 'Dry';
            if (level > 1050) return 'Slightly Dry';
            if (level > 700) return 'Moderate';
            if (level > 500) return 'Moist';
            return 'Wet';
        },

        getMoistureStatusClass(level) {
            if (level === undefined || level === null) return 'text-gray-500';

            if (level > 1600) return 'text-red-500 font-medium';
            if (level > 1050) return 'text-orange-500 font-medium';
            if (level > 700) return 'text-green-500 font-medium';
            if (level > 500) return 'text-blue-400 font-medium';
            return 'text-blue-600 font-medium';
        },

        viewDetails(data) {
            console.log('View details for:', data);
        },

        async updateStatus() {
            const now = new Date();
            const epochTimeMilliseconds = now.getTime(); // Get milliseconds since epoch
            const epochTimeSeconds = Math.floor(epochTimeMilliseconds / 1000);
            try {
                const docRef = doc(db, 'toggleStatus', 'mainToggle')
                await setDoc(docRef, {
                    status: this.isChecked, 
                    timestamp: epochTimeSeconds,
                });
                console.log('Toggle sent to Firestore:', this.isChecked);
            } catch (error) {
                console.error('Error writing to Firestore:', error);
            }
        },
    },
};
</script>