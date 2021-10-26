import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'

Vue.use(Vuetify)

const theme = {
  dark: false,
  themes: {
    options: {
      customProperties: true,
    },
    light: {
      // primary: "#344059",
      // secondary: "#BFBFBF", // "#FFCDD2"
      // accent: "#2C4027",
      // info: "#4E7DA6",
      // success: "#26A699", // success: '#2C4027'
      // warning: "#F29727",
      // error: "#F24C3D",
      // background: "#f9f9f9",
      primary: '#ecb558',
      secondary: '#849372', // 'rgba(132, 147, 114, 1)'
      accent: '#6e8486', //'rgba(110, 132, 134, 1)'
      info: '#4E7DA6',
      success: '#26A699',
      warning: '#ecb558',
      error: '#F24C3D',
      // background: '#FFFFFF',
      background: '#000000',

      // backgroundDarken: "#f9f9f9",
      // background: "##FFCDD2",
    },
    dark: {
      // primary: colors.brown.darken1, // #E53935
      // secondary: colors.deepPurple.lighten4, // #FFCDD2
      // accent: colors.indigo.base, // #3F51B5
      // primary: "#E53935",
      // secondary: "#FFCDD2",
      // accent: "#3F51B5",

      primary: '#ecb558',
      secondary: '#849372', // 'rgba(132, 147, 114, 1)'
      accent: '#6e8486', //'rgba(110, 132, 134, 1)'
      info: '#5ca4e5',
      success: '#26A699',
      warning: '#ecb558',
      background: '#FFFFFF',
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
