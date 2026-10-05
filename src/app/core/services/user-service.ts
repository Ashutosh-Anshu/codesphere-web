import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse, QueryParameters } from '../../common/services/ApiResponse';
import { Product, Role, RoleDetailModel, RoleMenu, RolePermission, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private defaultUrl = environment.apiUrl + '/account';
  private http = inject(HttpClient);

  getAllAsync(queryParameters: QueryParameters)
    : Observable<ApiResponse<PaginatedResponse<User>>> {
    const url = `${this.defaultUrl}/getAllAsync`;

    const params = new HttpParams({
      fromObject: {
        pageNumber: queryParameters.pageNumber.toString(),
        pageSize: queryParameters.pageSize.toString(),
        ...(queryParameters.searchValue
          ? { searchValue: queryParameters.searchValue }
          : {}),
      }
    });

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(url, { params });
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteAsync/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }



  // ================Role==================

  getAllRoleAsync(queryParameters: QueryParameters)
    : Observable<ApiResponse<PaginatedResponse<Role>>> {
    const url = `${this.defaultUrl}/getAllRoleAsync`;

    const params = new HttpParams({
      fromObject: {
        pageNumber: queryParameters.pageNumber.toString(),
        pageSize: queryParameters.pageSize.toString(),
        ...(queryParameters.searchValue
          ? { searchValue: queryParameters.searchValue }
          : {})
      }
    });

    return this.http.get<ApiResponse<PaginatedResponse<Role>>>(url, {
      params
    });
  }

  getAllRoleMenu(): Observable<ApiResponse<RoleMenu[]>> {
    const url = `${this.defaultUrl}/getAllRoleMenu`;
    return this.http.get<ApiResponse<RoleMenu[]>>(url);
  }

  getRoleById(roleId: string): Observable<ApiResponse<Role>> {
    const url = `${this.defaultUrl}/getRoleById/${roleId}`;
    return this.http.get<ApiResponse<Role>>(url);
  }

  deleteRoleById(roleId: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteRoleById/${roleId}`;
    return this.http.delete<ApiResponse<void>>(url);
  }

  createOrUpdateRoleAsync(roleDetailModel: RoleDetailModel)
    : Observable<ApiResponse<RoleDetailModel>> {
    const url = `${this.defaultUrl}/createOrUpdateRoleAsync`;
    return this.http.post<ApiResponse<RoleDetailModel>>(url, roleDetailModel);
  }


}

