import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Model } from '../../models/model';
import { Product } from '../../models/product';
import { flush } from '@angular/core/testing';

@Component({
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  selector: 'app-create-category-wise-product.component',
  styleUrl: './create-category-wise-product.component.css',
  templateUrl: './create-category-wise-product.component.html',
})
export class CreateCategoryWiseProductComponent implements OnInit {

private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  categoryForm!: FormGroup;
  models: Model[] = [];
  isSubmitting = false;
  imagePreviews: (string | null)[] = [];
  ngOnInit(): void {
    this.initForm();
    this.loadModels();
  }
  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      products: this.fb.array([])
    });    
    this.addProduct();
  }
  get products(): FormArray {
    return this.categoryForm.get('products') as FormArray;
  }
  newProduct(): FormGroup {
    return this.fb.group({
      productID: [0],
      name: ['', Validators.required],
      productNumber: ['', Validators.required],
      color: [''],
      standardCost: [0, [Validators.required, Validators.min(0)]],
      listPrice: [0, [Validators.required, Validators.min(0)]],
      size: [0, Validators.min(0)],
      weight: [0, Validators.min(0)],
      modelId: ['', Validators.required],
      image: [null]
    });
  }
  addProduct(): void {
    this.products.push(this.newProduct());
    this.imagePreviews.push(null); 
  }
  removeProduct(index: number): void {
   if(this.products.length>1){
    this.products.removeAt(index);
    this.imagePreviews.splice(index,1);
   }
   else{
    alert('Category Must Contain at least One product')
   }
  }
  loadModels(): void {
    this.categoryService.getModels().subscribe({
      next: (data) => (this.models = data),
      error: (err) => console.error('Error loading models:', err)
    });
  }

  onFileSelected(event:Event,index:number):void{
    const fileInput =event.target as HTMLInputElement;
    if(fileInput.files && fileInput.files[0]){
      const file=fileInput.files[0];
      this.products.at(index).patchValue({image:file});
      const reader = new FileReader();
      reader.onload=()=>
        {
          this.imagePreviews[index]=reader.result as string;
          this.cdr.detectChanges();
        }
        reader.readAsDataURL(file)
    }
  }
  OnSubmit():void
{
if(this.categoryForm.invalid)
{
  this.categoryForm.markAllAsTouched();
  return;
}
this.isSubmitting=true;
const categoryData=this.categoryForm.value;
this.categoryService.saveCategory(categoryData,false).subscribe({
  next:()=>{
    this.isSubmitting=false;
    this.router.navigate(['/categories'])
  },
  error:(err)=>{
    console.error('Error Saving Data: '+err)
    this.isSubmitting=false;
  }
})
}

}