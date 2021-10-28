import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import firebase from '../plugins/firebase.js'
import store from '@/store'

Vue.use(VueRouter)

const onlyAuthUser = (to, from, next) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      next()
    } else {
      store.dispatch('openAlert', {
        color: 'primary',
        icon: 'mdi-alert-circle-outline',
        message: '로그인이 필요해요',
        nextBtn: true,
        nextFunction: () => {
          router.push({ name: 'Mypage' })
        },
      })
    }
  })
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/Map.vue'),
  },
  {
    path: '/courtlist',
    name: 'CourtList',
    component: () => import('../views/Court/CourtList.vue'),
  },
  {
    path: '/courtdetail/:courtId',
    name: 'CourtDetail',
    component: () => import('../views/Court/CourtDetail.vue'),
  },
  {
    path: '/courtregist',
    name: 'CourtRegist',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Court/CourtRegist.vue'),
  },
  {
    path: '/report',
    name: 'Report',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/Report.vue'),
  },
  {
    path: '/findpeoplehome',
    name: 'FindPeopleHome',
    component: () => import('../views/FindPeople/FindPeopleHome.vue'),
  },
  {
    path: '/findpeopleregist',
    name: 'FindPeopleRegist',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/FindPeople/FindPeopleRegist.vue'),
  },
  {
    path: '/findpeopledetail/:scheduleId',
    name: 'FindPeopleDetail',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/FindPeople/FindPeopleDetail.vue'),
  },
  {
    path: '/mypage',
    name: 'Mypage',
    component: () => import('../views/Mypage/Mypage.vue'),
  },
  {
    path: '/edituserinfo',
    name: 'EditUserInfo',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/EditUserInfo.vue'),
  },
  {
    path: '/findpeoplerecord',
    name: 'FindPeopleRecord',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/FindPeopleRecord.vue'),
  },
  {
    path: '/findpeoplealert',
    name: 'FindPeopleAlert',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/FindPeopleAlert.vue'),
  },
  {
    path: '/findcourtrecord',
    name: 'FindCourtRecord',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/FindCourtRecord.vue'),
  },
  {
    path: '/findcourtalert',
    name: 'FindCourtAlert',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/FindCourtAlert.vue'),
  },
  {
    path: '/operationpolicy',
    name: 'OperationPolicy',
    component: () => import('../views/Mypage/OperationPolicy.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    beforeEnter: onlyAuthUser,
    component: () => import('../views/Mypage/Admin.vue'),
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
