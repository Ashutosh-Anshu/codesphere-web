import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  protected isAddMode: boolean = false;
  protected isEditMode: boolean = false;
  protected isViewMode: boolean = false;
  protected isDeleteMode: boolean = false;
  private readonly spinner = inject(NgxSpinnerService);

  
  protected startLoading(): void {
    this.spinner.show();
  }

  protected stopLoading(): void {
    this.spinner.hide();
  }

}
