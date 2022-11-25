import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { KnobModule } from 'primeng/knob';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    AvatarModule,
    KnobModule
  ],
  exports: [
    ButtonModule,
    TableModule,
    AvatarModule,
    KnobModule
  ]
})
export class SharedModule { }
