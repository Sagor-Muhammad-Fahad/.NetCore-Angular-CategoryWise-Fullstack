import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Category } from '../models/category';
import { Model } from '../models/model';

@Service()
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5289';
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/Categories/${id}`);
  }

  getModels(): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.apiUrl}/Categories/Models`);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Categories/${id}`);
  }

  saveCategory(category: Category, isEdit: boolean): Observable<Category | void> {
    const formData = this.buildFormData(category);
    if (isEdit) {
      return this.http.put<void>(`${this.apiUrl}/Categories/${category.categoryID}`, formData);
    } else {
      return this.http.post<Category>(`${this.apiUrl}/Categories`, formData);
    }
  }
  buildFormData(category: Category): FormData {
    const formData = new FormData();
    if (category.categoryID) {
      formData.append('CategoryID', category.categoryID.toString());
    }
    formData.append('Name', category.name || '');
    if (category.products && category.products.length > 0) {
      category.products.forEach((product, index) => {
        if (product.productID) {
          formData.append(`Products[${index}].ProductID`, product.productID.toString());
        }
        formData.append(`Products[${index}].CategoryID`, (product.categoryID || 0).toString());
        formData.append(`Products[${index}].Name`, product.name || '');
        formData.append(`Products[${index}].ProductNumber`, product.productNumber || '');
        if (product.color) formData.append(`Products[${index}].Color`, product.color || '');
        const cost = isNaN(Number(product.standardCost)) ? 0 : Number(product.standardCost);
        const price = isNaN(Number(product.listPrice)) ? 0 : Number(product.listPrice);
         const size = isNaN(Number(product.size)) ? 0 : Number(product.size);
        const weight = isNaN(Number(product.weight)) ? 0 : Number(product.weight);
        const modelId = isNaN(Number(product.modelId)) ? 0 : Number(product.modelId);

        formData.append(`Products[${index}].StandardCost`, cost.toString());
        formData.append(`Products[${index}].ListPrice`, price.toString());
        formData.append(`Products[${index}].Weight`, weight.toString());
        formData.append(`Products[${index}].Size`, size.toString());
        formData.append(`Products[${index}].ModelId`, modelId.toString());
        formData.append(
          `Products[${index}].ModifiedDate`,
          product.modifiedDate || new Date().toISOString(),
        );
        if (product.imagePath) {
          formData.append(`Products[${index}].ImagePath`, product.imagePath);
        }
        if (product.image) {
          formData.append(`Products[${index}].Image`, product.image, product.image.name);
        }
      });
    }
    return formData;
  }

  getImageUrl(path?: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
