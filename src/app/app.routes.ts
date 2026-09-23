import { Routes } from '@angular/router';
import { MainLayout } from './layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'crudOperations',
                loadComponent: () => import('./features/product-inventory/product-inventory').then((m) => m.ProductInventory),
            },
            {
                path:'identityAccess',
                loadComponent: () => import('./features/identity-access/identity-access').then((m) => m.IdentityAccess)
            }

        ]
    }
];
