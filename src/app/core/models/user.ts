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
}