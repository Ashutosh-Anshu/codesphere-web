import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ApiResponse, PaginatedResponse, QueryParameters } from '../../common/services/ApiResponse';
import { LoginRequest, LoginResponse, Menu, Product, Role, RoleDetailModel, RoleItem, RoleMenu, RolePermission, User, UserDetailModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private defaultUrl = environment.apiUrl + '/account';
  private http = inject(HttpClient);
  private refreshMenusSubject = new Subject<void>();
  refreshMenus$ = this.refreshMenusSubject.asObservable();

  refreshMenus(): void {
    this.refreshMenusSubject.next();
  }

  getAllUsersAsync(queryParameters: QueryParameters)
    : Observable<ApiResponse<PaginatedResponse<User>>> {
    const url = `${this.defaultUrl}/getAllUsersAsync`;

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

  getAllUserRoles(): Observable<RoleItem[]> {
    const url = `${this.defaultUrl}/getAllUserRoles`;
    return this.http.get<RoleItem[]>(url);
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    const url = `${this.defaultUrl}/deleteUserById/${id}`;
    return this.http.delete<ApiResponse<void>>(url);
  }

  getUserById(userId: string): Observable<ApiResponse<UserDetailModel>> {
    const url = `${this.defaultUrl}/getUserById/${userId}`;
    return this.http.get<ApiResponse<UserDetailModel>>(url);
  }

  createOrUpdateUserAsync(
    userDetailModel: UserDetailModel
  ): Observable<ApiResponse<UserDetailModel>> {
    const url = `${this.defaultUrl}/createOrUpdateUserAsync`;

    return this.http.post<ApiResponse<UserDetailModel>>(
      url,
      userDetailModel
    );
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

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const url = `${this.defaultUrl}/loginAsync`;
    return this.http.post<ApiResponse<LoginResponse>>(url, credentials);
  }

  getMenusByUserId(userId: string): Observable<ApiResponse<Menu[]>> {
    const url = `${this.defaultUrl}/getMenusByUserId/${userId}`;
    return this.http.get<ApiResponse<Menu[]>>(url);
  }


}

