import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-custom-message-item-dialog',
  templateUrl: './custom-message-item-dialog.component.html',
  styleUrls: ['./custom-message-item-dialog.component.scss']
})
export class CustomMessageItemDialogComponent implements OnInit {

  description: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<CustomMessageItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.description = data.title;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    const customization: string = (<HTMLInputElement>document.getElementById('custom-message-input')).value;
    this.dialogRef.close(customization);
  }
}
