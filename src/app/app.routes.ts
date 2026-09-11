import { Routes } from '@angular/router';
import { MainLayout } from './layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'crud-implementation',
                loadComponent: () => import('./features/crud-implementation/crud-implementation').then((m) => m.CrudImplementation),
            },

        ]
    }
];
