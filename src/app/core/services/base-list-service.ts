import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseListService extends BaseService { }
