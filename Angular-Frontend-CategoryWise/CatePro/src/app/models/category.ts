import { Product } from "./product";

export interface Category {
    categoryID:number,
    name:string;
    products:Product[];
}
