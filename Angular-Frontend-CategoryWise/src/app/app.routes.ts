import { Routes } from '@angular/router';
import { DisplayCategoryListComponent } from './components/display-category-list.component/display-category-list.component';
import { CreateCategoryWiseProductComponent } from './components/create-category-wise-product.component/create-category-wise-product.component';
import { EditCategoryWiseProductComponent } from './components/edit-category-wise-product.component/edit-category-wise-product.component';

export const routes: Routes = [
    {path:'',redirectTo:'categories',pathMatch:'full'},
    {path:'categories',component:DisplayCategoryListComponent},
    {path:'categories/add',component:CreateCategoryWiseProductComponent},
    {path:'categories/edit/:id',component:EditCategoryWiseProductComponent},
    {path:'**',redirectTo:'categories'}
];
