import { Model } from "./model";

export interface Product {
    productID?:number;
    name:string;
    productNumber:string;
    color?:string;
    standardCost:number;
    listPrice:number;
    size:number;
    weight:number;
    image?:File;
    imagePath:string;
    modifiedDate:string;
    categoryID?:number;
    modelId?:number;
    model?:Model;
}
