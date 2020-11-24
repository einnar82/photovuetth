import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Cloudinary, { CldImage, CldTransformation } from "cloudinary-vue";

Vue.use(Buefy)
Vue.use(Cloudinary, {
  configuration: { cloudName: "demo" },
  components: {
    CldImage,
    CldTransformation
  }
});
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
