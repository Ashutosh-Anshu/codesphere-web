import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../common/services/ApiResponse';
import { Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private defaultUrl = environment.apiUrl + '/product';
  private http = inject(HttpClient);

  getAllAsync(): Observable<ApiResponse<Product[]>> {
    const url = `${this.defaultUrl}/getAllAsync`;
    return this.http.get<ApiResponse<Product[]>>(url);
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    const url = `${this.defaultUrl}/getByIdAsync/${id}`;
    return this.http.get<ApiResponse<Product>>(url);
  }

  createOrUpdateAsync(product: any): Observable<ApiResponse<Product>> {debugger
    const url = `${this.defaultUrl}/createOrUpdateAsync`;
    return this.http.post<ApiResponse<Product>>(url, product);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteAsync/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }
}
