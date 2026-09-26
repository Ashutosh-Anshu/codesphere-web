import { Routes } from '@angular/router';
import { MainLayout } from './layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'crudOperations',
                loadComponent: () => import('./features/product-inventory/product-inventory')
                    .then((m) => m.ProductInventory),
            },

            {
                path: 'login',
                loadComponent: () => import('./features/login/login').then(x => x.Login)
            },

            {
                path: 'users',
                loadComponent: () => import('./features/users/user-list').then(x => x.UserList)
            },

            {
                path: 'roles',
                loadComponent: () => import('./features/roles/role-list').then(x => x.RoleList)
            }
        ]
    }
];