import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'

Vue.use(Vuetify)

const theme = {
  // dark: false,
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

      primary: '#485c60', //'rgba(72,92,96)'
      secondary: '#667456', // 'rgba(102,116,86)',

      accent: '#ecb558',
      info: '#4E7DA6',
      success: '#26A699',
      warning: '#ecb558',
      error: '#F24C3D',
      background: '#FFFFFF',

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

      primary: '#485c60', //'rgba(72,92,96)'
      secondary: '##667456', // 'rgba(102,116,86)',
      accent: '#ecb558',

      info: '#5ca4e5',
      success: '#26A699',
      warning: '#ecb558',
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
