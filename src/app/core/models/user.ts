export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string | Date;
  modifiedAt: string | Date;
}

export interface Role {
  roleId: string;
  name: string;
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
  actionId: string;
  isAllowed: boolean;
}



