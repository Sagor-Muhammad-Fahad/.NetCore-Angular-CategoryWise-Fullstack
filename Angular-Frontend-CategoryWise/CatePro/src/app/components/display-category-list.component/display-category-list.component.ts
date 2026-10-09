import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

@Component({
  imports: [CommonModule,RouterLink],
  selector: 'app-display-category-list.component',
  styleUrl: './display-category-list.component.css',
  templateUrl: './display-category-list.component.html',
})
export class DisplayCategoryListComponent {
deleteCategory(categoryId?: number):void {
if(!categoryId) return;
if(!confirm('are you sure')) return;
this.categoryService.deleteCategory(categoryId).subscribe({
  next:()=>this.loadData(),
  error:(err)=>console.error('error deleting :' +err)
});
throw new Error('Method not implemented.');
}

DeleteProduct(product: Product,categoryId: number):void 
{
  if(!categoryId) return;
  if(!confirm('Are you sure to delete this recod?')) return;
  const targetCategory=this.categories().find(c=>c.categoryID==categoryId);
  if(!targetCategory) return;
  const reaminingProducts=(targetCategory.products||[]).filter(p=>p.productID!==product.productID);
  const updateCategory:Category={...targetCategory,products:reaminingProducts}
  this.categoryService.saveCategory(updateCategory,true).subscribe({
    next:()=>this.loadData(),
    error:(err)=>{console.error('Error occured to remove product from category',err)}
  })

}

editCategory(categoryId: number):void
 {
   const category =this.categories().find(c=>c.categoryID==categoryId);
   if(category){
    this.router.navigate(['/categories/edit',category.categoryID])
   }
}
  private categoryService=inject(CategoryService);
  private router= inject(Router);
  categories=signal<Category[]>([]);
  isLoading=signal<boolean>(true);
  ngOnInit():void{
   this.loadData();
  }
  loadData():void{
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next:(data)=>{
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error:(err)=>{
        console.error('Error occured: '+err);
        this.isLoading.set(false);
      }
    });
  }
  getImageUrl(path?:string):string{
    return this.categoryService.getImageUrl(path);
  }
}
