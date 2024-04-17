import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-notification-confirmation-component',
  templateUrl: './notification-confirmation-component.component.html',
  styleUrls: ['./notification-confirmation-component.component.scss']
})
export class NotificationConfirmationComponentComponent implements OnInit {

  description: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<NotificationConfirmationComponentComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.description = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
