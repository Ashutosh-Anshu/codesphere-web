import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, QueryParameters } from '../../common/services/ApiResponse';
import { Product, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private defaultUrl = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  getAllAsync(queryParameters: QueryParameters, roleIds: string[])
    : Observable<ApiResponse<PaginatedResponse<User>>> {
    const url = `${this.defaultUrl}/getAllAsync`;

    const params = new HttpParams({
      fromObject: {
        pageNumber: queryParameters.pageNumber.toString(),
        pageSize: queryParameters.pageSize.toString(),
        ...(queryParameters.searchValue
          ? { searchValue: queryParameters.searchValue }
          : {}),
        roleIds: roleIds
      }
    });

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(url, {
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

  deleteUser(id: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteAsync/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }
}

