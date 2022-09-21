import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/ol-demo-OSM",
      name:"ol-demo-OSM",
      component: () => import("../views/Ol-demo-OSM.vue"),
    },
    {
      path: "/ol-demo-gemo-shapes",
      name:"ol-demo-gemo-shapes",
      component: () => import("../views/Ol-demo-gemo-shaps.vue"),
    },
    {
      path: "/ol-demo-map-debug",
      name:"ol-demo-map-debug",
      component: () => import("../views/Ol-demo-map-debug.vue"),
    },
    {
      path: "/ol-demo-map-resolution",
      name:"ol-demo-map-resolution",
      component: () => import("../views/Ol-demo-map-resolution.vue"),
    },
    {
      path: "/ol-demo-mark-div",
      name: "/ol-demo-mark-div",
      component: () => import("../views/Ol-demo-mark-div.vue"),
    },
    {
      path: "/Ol-demo-mark-feature-style",
      name: "/Ol-demo-mark-feature-style",
      component: () => import("../views/Ol-demo-mark-feature-style.vue"),
    },
    {
      path: "/Ol-demo-7-wms-connection",
      name: "/Ol-demo-7-wms-connection",
      component: () => import("../views/Ol-demo-7-wms-connection.vue"),
    },
    {
      path: "/Ol-demo-8-wfs-connection",
      name: "/Ol-demo-8-wfs-connection",
      component: () => import("../views/Ol-demo-8-wfs-connection.vue"),
    },
    {
      path: "/Ol-demo-9-wfs-modify",
      name: "/Ol-demo-9-wfs-modify",
      component: () => import("../views/Ol-demo-9-wfs-modify.vue"),
    },
    {
      path: "/Ol-demo-10-wfs-modify",
      name: "/Ol-demo-10-wfs-modify",
      component: () => import("../views/Ol-demo-10-wfs-modify.vue"),
    },
    {
      path: "/Ol-demo-11-wfs-add",
      name: "/Ol-demo-11-wfs-add",
      component: () => import("../views/Ol-demo-11-wfs-add.vue"),
    }, 
    {
      path: "/Ol-demo-12-wfs-modify",
      name: "/Ol-demo-12-wfs-modify",
      component: () => import("../views/Ol-demo-12-wfs-modify.vue"),
    },
    {
      path: "/Ol-demo-14-wfs-draw-points",
      name: "/Ol-demo-14-wfs-draw-points",
      component: () => import("../views/Ol-demo-14-wfs-draw-points.vue"),
    },
    {
      path: "/Ol-demo-15-wfs-draw-points",
      name: "/Ol-demo-15-wfs-draw-points",
      component: () => import("../views/Ol-demo-15-wfs-draw-points.vue"),
    },
  ],
});

export default router;
