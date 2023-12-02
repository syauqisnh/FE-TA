import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import axios from 'axios';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { title: 'Dashboard' }
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/Data-level',
                    name: 'Data-level',
                    component: () => import('@/views/uikit/Data-level.vue')
                },
                {
                    path: '/uikit/data-module',
                    name: 'data-module',
                    component: () => import('@/views/uikit/data-module.vue')
                },
                {
                    path: '/uikit/data-permission',
                    name: 'data-permission',
                    component: () => import('@/views/uikit/data-permission.vue')
                },
                {
                    path: '/uikit/data-access',
                    name: 'data-access',
                    component: () => import('@/views/uikit/data-access.vue')
                },
                {
                    path: '/uikit/data-media',
                    name: 'data-media',
                    component: () => import('@/views/uikit/data-media.vue')
                },
                {
                    path: '/uikit/data-customer',
                    name: 'data_customer',
                    component: () => import('@/views/uikit/data-customer.vue')
                },
                {
                    path: '/uikit/data-user',
                    name: 'data_user',
                    component: () => import('@/views/uikit/data-user.vue')
                },
                {
                    path: '/uikit/data-bussiness',
                    name: 'data-bussiness',
                    component: () => import('@/views/uikit/data-bussiness.vue')
                },
                {
                    path: '/uikit/data-price-list',
                    name: 'data-price-list',
                    component: () => import('@/views/uikit/data-price-list.vue')
                },
                {
                    path: '/uikit/data-tnc',
                    name: 'data-tnc',
                    component: () => import('@/views/uikit/data-tnc.vue')
                },
                {
                    path: '/uikit/data-scopes',
                    name: 'data-scopes',
                    component: () => import('@/views/uikit/data-scopes.vue')
                },
                {
                    path: '/uikit/data-teams',
                    name: 'data-teams',
                    component: () => import('@/views/uikit/data-teams.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/utilities/Documentation.vue')
                },
                {
                    path: '/Edit-profile',
                    name: 'Edit-profile',
                    component: () => import('@/views/utilities/Edit-profile.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/Landing-2',
            name: 'Landing-2',
            component: () => import('@/views/pages/Landing-2.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/login-2',
            name: 'login-2',
            component: () => import('@/views/pages/auth/Login-2.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/logout',
            name: 'error',
            component: async () => {
                alert('Anda telah logout')
                try {
                    const response = await axios.delete(`http://localhost:9900/api/v1/logout`);
                    if (response) {
                        console.log(response);
                        window.location.reload();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    ]
});

export default router;
