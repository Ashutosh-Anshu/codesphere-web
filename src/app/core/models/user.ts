export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserDetailModel {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  isActive: boolean;
}

export interface UserDetailResponse extends User {
  roleId: string;
}



export interface RoleItem{
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

export interface RoleDetailModel extends Role {
  permissions: RolePermission[];
}

export interface RolePermission {
  menuId: string;
  permissionId: string;
  isAllowed: boolean;
}



