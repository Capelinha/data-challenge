import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail-popup',
  templateUrl: './detail-popup.component.html'
})
export class DetailPopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetailPopupComponent>,
  ) { }

  ngOnInit() {

  }

  submit() {
    this.dialogRef.close();
  }
}
