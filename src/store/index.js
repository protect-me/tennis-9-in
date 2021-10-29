import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../plugins/firebase.js'
import { getCookie, setCookie } from '@/plugins/cookie.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    fireUser: null,
    user: null,
    unsubscribeFindPeople: null,
    schedules: [],
    schedule: {},
    court: {},
    selectedTab: null,
    alertInfo: null,
    confirmToggle: false,
    confirmInfo: null,
  },
  getters: {
    unsubscribeFindPeople(state) {
      return state.unsubscribeFindPeople
    },
  },
  mutations: {
    // commit
    updateState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]
      })
    },
    resetSchedules(state) {
      state.resetSchedules = []
      state.loading = false
    },
    setFireUser(state, payload) {
      state.fireUser = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    openAlert(state, payload) {
      state.alertInfo = payload
    },
    closeAlert(state, payload) {
      if (state.alertInfo) {
        state.alertInfo = payload
      }
    },
    openConfirm(state, payload) {
      state.confirmToggle = true
      state.confirmInfo = payload
    },
    closeConfirm(state) {
      state.confirmToggle = false
      state.confirmInfo = null
    },
  },
  actions: {
    // dispatch
    openAlert({ commit }, payload) {
      commit('openAlert', payload)
      setTimeout(() => {
        commit('closeAlert', null)
      }, 2000)
    },
    closeAlert({ commit }) {
      commit('openAlert', null)
    },
    openConfirm({ commit }, payload) {
      commit('openConfirm', payload)
    },
    closeConfirm({ commit }) {
      commit('closeConfirm')
    },
    setFireUser({ commit }, payload) {
      commit('setFireUser', payload)
    },
    setUser({ commit }, payload) {
      commit('setUser', payload)
    },
    setSelectedTab({ commit }, payload) {
      commit('updateState', {
        selectedTab: payload,
      })
    },
    setCourt({ commit }, payload) {
      commit('updateState', {
        court: payload,
      })
    },
    setSchedule({ commit }, payload) {
      commit('updateState', {
        schedule: payload,
      })
    },
    async setSchedules({ state, commit }) {
      if (state.loading) return // Loading 중일 경우 return

      try {
        commit('updateState', { loading: true }) // Loading On
        let schedules = []

        const unsubscribeFindPeople = await firebase
          .firestore()
          .collection('findPeople')
          .where('status', '!=', 4)
          .orderBy('status')
          .orderBy('date')
          .orderBy('startTime')
          .onSnapshot((snapshot) => {
            if (snapshot.empty) {
              return
            }
            schedules = snapshot.docs.map((value) => {
              const id = value.id
              const item = value.data()
              return {
                scheduleId: id,
                organizer: item.organizer,
                organizerNickName: item.organizerNickName,
                applicants: item.applicants,
                participants: item.participants,
                courtName: item.courtName,
                courtType: item.courtType,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                ntrp: item.ntrp,
                assignment: item.assignment,
                vacant: item.vacant,
                total: item.total,
                contact: item.contact,
                openChatLinkIndex: item.openChatLinkIndex,
                cost: item.cost,
                memo: item.memo,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                status: item.status,
              }
            })
            commit('updateState', {
              unsubscribeFindPeople,
              schedules,
              loading: false,
            })
          })
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '데이터를 가져오는데 실패했습니다',
        })
        console.log('데이터 로드 실패', err)
        commit('updateState', { loading: false })
      }
    },
    async checkVisitCount(_, pageName) {
      const cookieName =
        'tennis9inVisitHistory' +
        pageName[0].toUpperCase() +
        pageName.slice(1, pageName.length)
      const userHistory = getCookie(cookieName)
      if (!userHistory) {
        setCookie(cookieName, pageName, 1)
        try {
          await firebase
            .firestore()
            .collection('meta')
            .doc('visit')
            .update(pageName, firebase.firestore.FieldValue.increment(1))
        } catch (err) {
          console.log(err)
        }
      }
    },
  },
  modules: {},
})
