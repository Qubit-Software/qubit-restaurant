import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild('menu') menu: ElementRef;
  @ViewChild('close') close: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  widthModal = "0";
  open = false;

  constructor(private renderer: Renderer2) {

    this.renderer.listen('window', 'click', (e: Event) => {
      console.log(e.target);
      console.log(this.menu.nativeElement);
      if (e.target !== this.toggleButton.nativeElement && e.target !== this.menu.nativeElement && e.target !== this.close.nativeElement) {
        if (this.open) {
          this.openModal();
        }
      }
    });
  }

  ngOnInit(): void {

  }

  openModal() {
    if (this.open) {
      this.open = !this.open;
      this.widthModal = "0px";
    } else {
      this.open = !this.open;
      this.widthModal = "250px";
    }
    console.log(this.widthModal);
  }

}
