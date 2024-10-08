import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() {}
}
