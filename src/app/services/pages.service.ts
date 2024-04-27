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

export interface LogsModel {
  movement_type: string;
  code_product: string;
  lot: number;
  details: string
}

export interface existenceCheck {
  existente: boolean;
}

export interface Reports {
  movement_type: string;
  code_product: string;
  name: string;
  lot: number;
  datetime: Date;
  details: string;
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
  
  addStock(logsData : LogsModel): Observable<any> {
    return this.httpService.post(this.pages_end_point+'/sumar_stock', { ...logsData})
  }

  removeStock(logsData : LogsModel): Observable<any> {
    return this.httpService.post(this.pages_end_point+'/restar_stock', { ...logsData})
  }

  searchProduct(code: string): Observable<existenceCheck> {
    return this.httpService.get<existenceCheck>(`${this.pages_end_point}/buscar_codigo/${code}`);
  }

  showReports(): Observable<Reports[]> {
    return this.httpService.get<Reports[]>(this.pages_end_point + '/mostrar_reportes')
  }

}
