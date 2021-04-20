import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.css']
})
export class MainSettingsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }
  openModal() {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("menuModal").style.display = "block"
    document.getElementById("menuModal").className += "show"
  }
  closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("menuModal").style.display = "none"
    document.getElementById("menuModal").className += document.getElementById("menuModal").className.replace("show", "")
    this.router.navigate(['./'], { relativeTo: this.route });
  }
}
