export interface UserBase {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export interface User extends UserBase {
  fullName: string;
  roleName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserDetailModel extends UserBase {
  password: string;
  confirmPassword: string;
  roleId: string;
}

export interface UserDetailResponse extends User {
  roleId: string;
}

export interface RoleItem {
  roleId: string;
  name: string;
}

export interface Role extends RoleItem {
  description: string;
  isActive: boolean;
  isSystem: boolean;
  updatedAt: string | null;
}

export interface RoleAction {
  permissionId: string;
  permissionName: string;
}

export interface RoleMenu {
  menuId: string;
  menuName: string;
  description: string;
  permissions: RoleAction[];
}

export interface RolePermission {
  menuId: string;
  permissionId: string;
  isAllowed: boolean;
}

export interface RoleDetailModel extends Role {
  permissions: RolePermission[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  token: string;
  expiresIn: number;
  user: UserDetailResponse;
}

export interface Menu {
  menuId: string;
  name: string;
  icon: string;
  route: string | null;
  parentId: string | null;
}