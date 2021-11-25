import {Component, HostListener, Injectable} from "@angular/core";

@Component({
  template: ''
})
export abstract class ComponentCanDeactivate {

  abstract  canDeactivate(): boolean;



  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    console.log("Listen")
    if (!this.canDeactivate()) {
      $event.returnValue =true;
    }
  }
}
