import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'

Vue.use(Vuetify)

const theme = {
  dark: false,
  themes: {
    light: {
      // primary: "#344059",
      // secondary: "#BFBFBF", // "#FFCDD2"
      // accent: "#2C4027",
      // info: "#4E7DA6",
      // success: "#26A699", // success: '#2C4027'
      // warning: "#F29727",
      // error: "#F24C3D",
      // background: "#f9f9f9",
      primary: '#6e8486', //'rgba(110, 132, 134, 1)'
      secondary: '#849372', // 'rgba(132, 147, 114, 1)'
      accent: '#ecb558',
      info: '#4E7DA6',
      success: '#26A699',
      warning: '#ecb558',
      error: '#F24C3D',
      background: '#FFFFFF',
      customBlue: '#3f51b5',

      // backgroundDarken: "#f9f9f9",
      // background: "##FFCDD2",
      // background: "#000000",
    },
    dark: {
      // primary: colors.brown.darken1, // #E53935
      // secondary: colors.deepPurple.lighten4, // #FFCDD2
      // accent: colors.indigo.base, // #3F51B5
      // primary: "#E53935",
      // secondary: "#FFCDD2",
      // accent: "#3F51B5",

      primary: '#6e8486', //'rgba(110, 132, 134, 1)'
      secondary: '#849372', // 'rgba(132, 147, 114, 1)'
      accent: '#ecb558',
      info: '#5ca4e5',
      success: '#26A699',
      warning: '#ecb558',
      background: '#E53935',
      backgroundDarken: '#E53935',
      error: '#F24C3D',
    },
  },
}

const vuetifyObj = new Vuetify({
  lang: {
    locales: { en, ko },
    current: 'ko',
  },
  theme,
})

export default vuetifyObj
