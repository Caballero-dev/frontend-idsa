import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    KeyFilterModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss',
})
export class UsersFormComponent implements OnInit {
  @Input() userDialog: boolean = false;
  @Output() defaultChangeUserDialog = new EventEmitter<{ isOpen: boolean; message: string }>();
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      isActive: [''],
      role: [''],
    });
  }

  ngOnInit() {}

  closeDialog() {
    this.defaultChangeUserDialog.emit({ isOpen: false, message: 'close' });
  }

  saveUser() {
    console.log(this.userForm.value);
    this.defaultChangeUserDialog.emit({ isOpen: false, message: 'save' });
  }
}
