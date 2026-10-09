import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Model } from '../../models/model';
import { Product } from '../../models/product';

@Component({
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  selector: 'app-edit-category-wise-product.component',
  styleUrl: './edit-category-wise-product.component.css',
  templateUrl: './edit-category-wise-product.component.html',
})
export class EditCategoryWiseProductComponent implements OnInit{

  private route=inject(ActivatedRoute);
  private router=inject(Router);
  public categoryService=inject(CategoryService)
  category=signal<Category>({categoryID:0,name:'',products:[]})
  models=signal<Model[]>([]);
  isLoading=signal<boolean>(true);
  isSaving=signal<boolean>(false);
  ngOnInit(): void {
    this.loadModels();
    const id=Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      this.loadCategory(id);
    }
   
  }
  loadCategory(id:number):void{
    this.isLoading.set(true);
    this.categoryService.getCategoryById(id).subscribe({
      next:(data)=>{
        this.category.set(data);
        this.isLoading.set(false);
      },
      error:(err)=>{
        console.error('Error Loading Category:',err);
        this.isLoading.set(false);
      }
    })
  }
   loadModels(): void {
    this.categoryService.getModels().subscribe({
      next: (data) => (this.models.set(data)),
      error: (err) => console.error('Error loading models:', err)
    });
  }
  addProduct():void{
    const currentCate=this.category();
    const newProduct:Product={name:'',imagePath:'',
      productID:0,productNumber:'',listPrice:0,standardCost:0,size:0,weight:0,color:''
      ,modelId:this.models.length>0?this.models()[0].modelId:0,modifiedDate:new Date().toISOString()
    };
    this.category.set({
      ...currentCate,products:[...(currentCate.products || []),newProduct]
    })
  }
  removeProduct(index:number):void{
const currentCate =this.category();
if(!currentCate.products) return;
const updateProducts=currentCate.products.filter((_,i)=>i !==index);
this.category.set({...currentCate,products:updateProducts})
  }
  onFileChange(event:Event,index:number):void{
    const input=event.target as HTMLInputElement;
    if(input.files && input.files.length>0){
      const file=input.files[0];
      const currentCate=this.category();
      if(currentCate.products && currentCate.products[index]){
        currentCate.products[index].image=file;
      }
    }
  }
  onSubmit():void {
this.isSaving.set(true);
this.categoryService.saveCategory(this.category(),true).subscribe({
  next:()=>{
    this.isSaving.set(false);
    this.router.navigate(['categories'])
  },
  error:(err)=>{
    console.error('Error updating category'+err)
    this.isSaving.set(false);
  }
})
}
}
