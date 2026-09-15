import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  protected loading: boolean = false;
  protected isAddMode: boolean = false;
  protected isEditMode: boolean = false;
  protected isViewMode: boolean = false;
  protected isDeleteMode: boolean = false;

  protected startLoading(): void {
    
  }

  protected stopLoading(): void {
  }

}
