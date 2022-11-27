import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { KnobModule } from 'primeng/knob';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    AvatarModule,
    KnobModule,
    DividerModule,
    DropdownModule,
    MessageModule,
    InputTextModule,
    InputNumberModule,
    InputMaskModule,
    ToastModule,
  ],
  exports: [
    ButtonModule,
    TableModule,
    AvatarModule,
    KnobModule,
    DividerModule,
    DropdownModule,
    MessageModule,
    InputTextModule,
    InputNumberModule,
    InputMaskModule,
    ToastModule,
  ],
})
export class SharedModule {}
