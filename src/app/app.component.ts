import { Component } from '@angular/core';
import * as AWS from 'aws-sdk';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public nameFormControl: FormControl;
  public phoneFormControl: FormControl;
  public emailFormControl: FormControl;
  public messageFormControl: FormControl;
  public isUrgentCheckbox: boolean;
  public rememberMeCheckbox: boolean;
  public wedone: boolean;
  public error: any;

  private lambda;

  constructor() {
    AWS.config.update({region: 'us-east-1'});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:dccb1bbe-09ec-45d9-aba7-9019b8124df9'});
    this.lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});

    const savedName = localStorage.getItem('name') || '';
    const savedPhone = localStorage.getItem('phone') || '';
    const savedEmail = localStorage.getItem('email') || '';

    this.nameFormControl = new FormControl(savedName, [ Validators.required ]);
    this.phoneFormControl = new FormControl(savedPhone, [ Validators.required ]);
    this.emailFormControl = new FormControl(savedEmail, [ Validators.required, Validators.email ]);
    this.messageFormControl = new FormControl('', [ Validators.required, Validators.maxLength(140) ]);
  }

  public send() {
    const pullParams = {
      FunctionName : 'jason-button-sms',
      InvocationType : 'RequestResponse',
      LogType : 'None',
      Payload: JSON.stringify({
        name: this.nameFormControl.value,
        phone: this.phoneFormControl.value,
        email: this.emailFormControl.value,
        message: this.messageFormControl.value,
        isUrgent: this.isUrgentCheckbox
      })
    };

    this.lambda.invoke(pullParams, (error, data) => {
      this.wedone = true;
      console.log('this.wedone', this.wedone);
      if (error) {
        this.error = error;
      }
    });

    if (this.rememberMeCheckbox) {
      window.localStorage.setItem('name', this.nameFormControl.value);
      window.localStorage.setItem('phone', this.phoneFormControl.value);
      window.localStorage.setItem('email', this.emailFormControl.value);
    }
  }
}
