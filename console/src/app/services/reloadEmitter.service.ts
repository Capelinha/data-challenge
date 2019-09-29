import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadEmitterService {
  @Output()
  event: EventEmitter<any>;

  constructor() {
    this.event = new EventEmitter(true);
  }

  emit() {
    this.event.emit(true);
  }
}
