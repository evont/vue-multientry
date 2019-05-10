import Vue from "vue";
import Router from "vue-router";
import Home from './page/Home'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/game",
      name: "game",
      component: () => import(/* webpackChunkName: "game" */ "./page/game.vue")
    },
  ]
});
