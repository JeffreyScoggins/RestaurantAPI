import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent implements OnInit {

  description: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<NotificationPopupComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.description = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}

