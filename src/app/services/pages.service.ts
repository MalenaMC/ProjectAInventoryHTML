import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductModel {
    code: string;
    name: string;
    price: number;
    stock: number;
    details: string;
    image: string;
  }

@Injectable({
  providedIn: 'root'
})

export class PagesService {
  // 
  private httpService = inject(HttpClient);
  // 
  private pages_end_point = 'http://localhost:3000';
  constructor() { }
  
  addProduct(productData : FormData): Observable<any> {
    return this.httpService.post(this.pages_end_point+'/registrar_producto', productData);
  }

  showProduct(): Observable<ProductModel[]> {
    return this.httpService.get<ProductModel[]>(this.pages_end_point + '/mostrar_producto');
  }

  deleteProduct(code: string): Observable<any> {
    return this.httpService.delete(`${this.pages_end_point}/eliminar_producto/${code}`);
  } 
}
