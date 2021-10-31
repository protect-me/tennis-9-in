<template>
  <v-container>
    <canvas id="find-people-chart" width="100vw" height="100"></canvas>
  </v-container>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  mounted() {
    this.initData()
  },
  data() {
    return {
      loading: true,
      records: null,
      recordsUser: null,
      recordsFindPeople: {},
      recordsCourt: null,
      recordsVisit: null,
      labels: [],
    }
  },
  methods: {
    async initData() {
      try {
        this.loading = true
        const snapshot = await this.$firebase
          .firestore()
          .collection('records')
          .get()

        this.records = snapshot.docs.map((doc) => {
          const id = doc.id
          this.labels.push(id)
          return { id, ...doc.data() }
        })
        this.initDataFindPeople()
      } catch (err) {
        console.log('데이터 로드 실패', err)
      } finally {
        this.loading = false
      }
    },
    initDataFindPeople() {
      this.recordsFindPeople.type = 'line'
      this.recordsFindPeople.data = { labels: [], datasets: [] }
      this.recordsFindPeople.options = {
        responsive: true,
        lineTension: 0,
        scales: {},
      }
      this.recordsFindPeople.data.labels = this.labels.slice().map((label) => {
        const date = new Date(Number(label))
        console.log(label, date)
        return `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      })
      this.recordsFindPeople.data.datasets = [
        {
          label: 'Open',
          data: [],
          backgroundColor: ['red'],
          borderColor: ['red'],
          borderWidth: 3,
        },
        {
          label: 'Close',
          data: [],
          backgroundColor: ['green'],
          borderColor: ['green'],
          borderWidth: 3,
        },
        {
          label: 'Complete',
          data: [],
          backgroundColor: ['blue'],
          borderColor: ['blue'],
          borderWidth: 3,
        },
        {
          label: 'Expiration',
          data: [],
          backgroundColor: ['rgba(54,73,93,.5)'],
          borderColor: ['#36495d'],
          borderWidth: 3,
        },
      ]
      this.records.forEach((record) => {
        this.recordsFindPeople.data.datasets[0].data.push(record.findPeopleOpen)
        this.recordsFindPeople.data.datasets[1].data.push(
          record.findPeopleClose,
        )
        this.recordsFindPeople.data.datasets[2].data.push(
          record.findPeopleComplete,
        )
        this.recordsFindPeople.data.datasets[3].data.push(
          record.findPeopleExpiration,
        )
      })
      this.createChart('find-people-chart', this.recordsFindPeople)
    },
    createChart(charId, chartData) {
      const ctx = document.getElementById(charId)
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      })
    },
  },
}
</script>

<style></style>
