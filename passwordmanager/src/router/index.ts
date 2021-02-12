import {createRouter, createWebHistory} from '@ionic/vue-router';
import Main from '../views/Main.vue'

const routes = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                redirect: '/login'
            },
            {
                path: '/login',
                component: () => import('@/views/Login.vue')
            },
            {
                path: '/passwords',
                name: "passwords",
                props: true,
                component: () => import('@/views/Passwords.vue'),

            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
