<template>
  <v-container class="admin-container">
    <v-card>
      <v-card-title>
        게스트 모집
      </v-card-title>
      <v-card-text>
        <canvas id="find-people-chart" width="100vw" height="100"></canvas>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>
        회원 관리
      </v-card-title>
      <v-card-text>
        <canvas id="users-chart" width="100vw" height="100"></canvas>
      </v-card-text>
    </v-card>
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
      recordsUsers: {},
      recordsFindPeople: {},
      recordsCourt: {},
      recordsVisit: {},
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
        this.initDataUsers()
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
        return `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      })
      this.recordsFindPeople.data.datasets = [
        {
          label: 'Open',
          data: [],
          backgroundColor: ['tomato'],
          borderColor: ['tomato'],
          borderWidth: 3,
        },
        {
          label: 'Close',
          data: [],
          backgroundColor: ['yellowgreen'],
          borderColor: ['yellowgreen'],
          borderWidth: 3,
        },
        {
          label: 'Complete',
          data: [],
          backgroundColor: ['royalblue'],
          borderColor: ['royalblue'],
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
    initDataUsers() {
      this.recordsUsers.type = 'line'
      this.recordsUsers.data = { labels: [], datasets: [] }
      this.recordsUsers.options = {
        responsive: true,
        lineTension: 0,
        scales: {},
      }
      this.recordsUsers.data.labels = this.labels.slice().map((label) => {
        const date = new Date(Number(label))
        return `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      })
      this.recordsUsers.data.datasets = [
        {
          label: 'create',
          data: [],
          backgroundColor: ['royalblue'],
          borderColor: ['royalblue'],
          borderWidth: 3,
        },
        {
          label: 'delete',
          data: [],
          backgroundColor: ['tomato'],
          borderColor: ['tomato'],
          borderWidth: 3,
        },
      ]
      this.records.forEach((record) => {
        this.recordsUsers.data.datasets[0].data.push(record.createUser)
        this.recordsUsers.data.datasets[1].data.push(record.deleteUser)
      })
      this.createChart('users-chart', this.recordsUsers)
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

<style lang="scss" scoped>
.admin-container {
  height: calc(var(--vh, 1vh) * 100 - 48px);
  overflow: scroll;
}
</style>
