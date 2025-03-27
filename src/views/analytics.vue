<template>
  <navigation></navigation>
  <div class="flex justify-center p-4 ">
    <div class="ml-[17rem] max-w-3xl min-h-80 w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 ">
      <div class="flex justify-between">
        <div>
          <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{{ totalMoisture }}</h5>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">Average Moisture Level</p>
        </div>
        <!-- <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          {{ growthPercentage }}%
          <svg class="w-3 h-3 ms-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div> -->
      </div>

      <!-- Chart Container with explicit dimensions -->
      <div class="w-full h-64 mt-4">
        <apexchart
          width="100%"
          height="100%"
          type="area"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>

      <div class="flex justify-between items-center pt-5">
        <button @click.prevent="fetchSoilMoistureData()" 
                class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white">
          {{ selectedPeriod }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from '../components/navigation.vue';
import VueApexCharts from 'vue3-apexcharts';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../store/firebase';
import { getAuth } from 'firebase/auth';
export default {
  name: 'analytics',
  components: { 
    navigation, 
    apexchart: VueApexCharts 
  },
  data() {
    return {
      totalMoisture: 0,
      growthPercentage: 0,
      selectedPeriod: 'Current data',
      chartOptions: {
        chart: { 
          type: 'area',
          height: 300,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          fontFamily: 'Inter, sans-serif'
        },
        colors: ['#16BDCA'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        },
        dataLabels: { 
          enabled: false 
        },
        stroke: { 
          curve: 'smooth',
          width: 3
        },
        xaxis: { 
          categories: [],
          labels: {
            style: {
              colors: '#9CA3AF',
              fontSize: '12px',
              fontWeight: 500
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#9CA3AF',
              fontSize: '12px',
              fontWeight: 500
            },
            formatter: function (value) {
              return value.toFixed(1);
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value.toFixed(1);
            }
          }
        },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true
            }
          }
        }
      },
      chartSeries: [
        { 
          name: 'Moisture Level', 
          data: [] 
        }
      ]
    };
  },
  methods: {
    async fetchSoilMoistureData() {
      try {
        const q = query(
          collection(db, 'soilMoistureData'),
          orderBy('timestamp', 'asc'),
          // limit(100) // Fetch only the latest 100 records
        );
        const querySnapshot = await getDocs(q);

        const moistureData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Raw Timestamp:", data.timestamp);

          // Convert Firestore timestamp (epoch format) to a readable date format
          const rawTimestamp = Number(data.timestamp || 0);
          const timestamp = rawTimestamp
            ? new Date(rawTimestamp * 1000).toLocaleDateString('en-IN') // Convert epoch seconds to milliseconds
            : 'Unknown';

          return {
            timestamp,
            level: data.moisture || 0
          };
        });

        console.log("Processed Moisture Data:", moistureData);

        const timestamps = moistureData.map(entry => entry.timestamp);
        console.log("Timestamps:", timestamps);
        const moistureLevels = moistureData.map(entry => entry.level);

        // Update chart options and series
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            categories: timestamps,
            labels: {
              formatter: value => (value ? value.toString() : '')
            }
          }
        };
        this.chartSeries = [{ name: 'Moisture Level', data: moistureLevels }];

        // Calculate total moisture and growth percentage
        const total = moistureLevels.reduce((sum, level) => sum + level, 0);
        this.totalMoisture = moistureLevels.length > 0 ? (total / moistureLevels.length).toFixed(1) : 0;
        this.growthPercentage = this.calculateGrowth(moistureLevels);

        console.log("Timestamps:", timestamps);
        console.log("Moisture Levels:", moistureLevels);
      } catch (error) {
        console.error('Error fetching soil moisture data:', error);
      }
    },

    calculateGrowth(moistureLevels) {
      if (moistureLevels.length < 2) return 0;
      const latest = moistureLevels[moistureLevels.length - 1];
      const earliest = moistureLevels[0];
      return earliest === 0 ? 0 : (((latest - earliest) / earliest) * 100).toFixed(1);
    }
  },
  mounted() {
    this.fetchSoilMoistureData();
  }
};
</script>

<style>
/* Global styles for ApexCharts */
.apexcharts-tooltip {
  background: #374151 !important;
  color: #F9FAFB !important;
  border: none !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  border-radius: 0.375rem !important;
}

.apexcharts-tooltip-title {
  background: #4B5563 !important;
  border-bottom: 1px solid #6B7280 !important;
  font-weight: 600 !important;
}

.apexcharts-xaxistooltip {
  background: #374151 !important;
  color: #F9FAFB !important;
  border: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
  border-radius: 0.25rem !important;
}

.apexcharts-xaxistooltip-bottom::before,
.apexcharts-xaxistooltip-bottom::after {
  border-bottom-color: #374151 !important;
}
</style>
