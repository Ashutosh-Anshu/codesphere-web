import { Routes } from '@angular/router';
import { MainLayout } from './layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/product-inventory/product-inventory')
                    .then((m) => m.ProductInventory),
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/user-list').then(x => x.UserList)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/employees/employee-list').then(x => x.EmployeeList)
            },

            {
                path: 'roles',
                loadComponent: () => import('./features/roles/role-list').then(x => x.RoleList)
            }
        ]
    }
];