import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, QueryParameters } from '../../common/services/ApiResponse';
import { Product } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private defaultUrl = environment.apiUrl + '/product';
  private http = inject(HttpClient);

  getAllAsync(queryParameters: QueryParameters)
    : Observable<ApiResponse<PaginatedResponse<Product>>> {
    const url = `${this.defaultUrl}/getAllAsync`;

    const params = new HttpParams({
      fromObject: {
        pageNumber: queryParameters.pageNumber.toString(),
        pageSize: queryParameters.pageSize.toString(),
        ...(queryParameters.searchValue
          ? { searchValue: queryParameters.searchValue }
          : {})
      }
    });

    return this.http.get<ApiResponse<PaginatedResponse<Product>>>(url, {
      params
    });
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    const url = `${this.defaultUrl}/getByIdAsync/${id}`;
    return this.http.get<ApiResponse<Product>>(url);
  }

  createOrUpdateAsync(product: any): Observable<ApiResponse<Product>> {
    const url = `${this.defaultUrl}/createOrUpdateAsync`;
    return this.http.post<ApiResponse<Product>>(url, product);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteAsync/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }
}
