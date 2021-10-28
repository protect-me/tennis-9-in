<template>
  <v-container class="map-container pa-0">
    <div id="map"></div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted() {
    window.kakao && window.kakao.maps
      ? this.initMap()
      : this.addKakaoMapScript()
    this.$nextTick(async function () {
      this.initData()
    })
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  data() {
    return {
      map: null,
      markers: [],
      courts: [],
      selectedMarker: null,
    }
  },
  methods: {
    async initData() {
      try {
        const courtsSnapshot = await this.$firebase
          .firestore()
          .collection('courts')
          .orderBy('courtId')
          .get()
        this.courts = courtsSnapshot.docs.map((value) => {
          const id = value.id
          const item = value.data()
          return {
            courtId: id,
            courtName: item.courtName,
            address: item.address,
            addressJibun: item.addressJibun,
            addressSigungu: item.addressSigungu,
            addressLocal: item.addressLocal,
            lat: item.lat,
            lng: item.lng,
            types: item.types,
            courtTypes: item.courtTypes,
            memo: item.memo,
            count: 0,
          }
        })
        const schedulesSnapshot = await this.$firebase
          .firestore()
          .collection('findPeople')
          .where('status', '==', 1)
          .orderBy('courtId')
          .get()
        schedulesSnapshot.docs.forEach((value) => {
          const curCourtId = value.data().courtId
          const len = this.courts.length
          for (let i = 0; i < len; i++) {
            if (curCourtId === this.courts[i].courtId) {
              this.courts[i].count++
            }
          }
        })
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '데이터를 가져오는데 실패했습니다',
        })
        console.log('데이터 로드 실패', err)
      }
      this.setMarker()
    },
    addKakaoMapScript() {
      const script = document.createElement('script')
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY}`
      document.head.appendChild(script)
    },
    initMarkers() {
      this.markers.forEach((marker) => {
        marker.setMap(null)
      })
    },
    initMap() {
      var container = document.getElementById('map') //지도를 담을 영역의 DOM 레퍼런스
      var options = {
        // 지도 생성 기본 옵션
        center: new kakao.maps.LatLng(37.5609532, 126.9789347), //지도의 중심좌표. // 시청
        level: 8, //지도의 레벨(확대, 축소 정도)
      }

      var map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴

      var zoomControl = new kakao.maps.ZoomControl() //줌 컨트롤 생성
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
      this.map = map
    },
    setMarker() {
      this.initMarkers() // 기존 마커 초기화
      let that = this
      let map = this.map

      // 마커 이미지의 이미지 주소
      var imageSrc = require('../assets/marker.png')
      // 마커 이미지의 이미지 크기 세팅
      var imageSize = new kakao.maps.Size(22, 34)
      // 마커 이미지를 생성
      var normalImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
      // var clickedImage = new kakao.maps.MarkerImage(clickedImageSrc, imageSize);
      // set court latlng
      const len = this.courts.length
      for (var i = 0; i < len; i++) {
        // 마커 생성
        const latlng = new kakao.maps.LatLng(
          Number(this.courts[i].lat),
          Number(this.courts[i].lng),
        )
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: latlng, // 마커를 표시할 위치
          image: normalImage, // 마커 이미지
        })

        let cropedCourtName = ''
        const cropIndex = this.courts[i].courtName.indexOf('테니스장')
        if (cropIndex > 0) {
          cropedCourtName = this.courts[i].courtName.slice(0, cropIndex).trim()
        } else {
          cropedCourtName = this.courts[i].courtName
        }
        var basicInfo = `<div class="customoverlay">
              <div class="customoverlay-count">
              ${cropedCourtName}:${this.courts[i].count}
              </div>
          </div>`
        var customOverlay = new kakao.maps.CustomOverlay({
          clickable: true,
          map: map,
          position: latlng,
          content: basicInfo,
          xAnchor: 0.5, // xAnchor: 0.42,
          yAnchor: 2.5, // yAnchor: 1.5,
          zIndex: 3,
        })
        const court = this.courts[i]
        kakao.maps.event.addListener(
          marker,
          'click',
          makeOverClickListener(map, marker, court),
        )
        this.markers.push(marker) // this.markers 배열에 추가
      }

      function makeOverClickListener(map, marker, court) {
        return () => that.goToDetail(court)
      }
    },
    async goToDetail(item) {
      await this.$store.dispatch('setCourt', item)
      this.$router.push(`/courtdetail/${item.courtId}`)
    },
  },
}
</script>

<style lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}
#map {
  margin-top: 5px;
  width: calc(100% - 5px);
  height: 100%;
  .customoverlay {
    .customoverlay-count {
      border: 2px solid rgba(55, 124, 33);
      border-radius: 10px;
      padding: 0 10px;
      background-color: white;
      font-size: 14px;
      color: rgba(55, 124, 33);
      font-weight: 900;
    }
  }
}
</style>
