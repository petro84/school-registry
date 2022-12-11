import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageCropperModule } from 'ngx-image-cropper';

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
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';

@NgModule({
  declarations: [
    PhotoEditorComponent
  ],
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
    DialogModule,
    MessagesModule,
    AutoCompleteModule,
    TooltipModule,
    ImageCropperModule,
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
    DialogModule,
    MessagesModule,
    AutoCompleteModule,
    TooltipModule,
    PhotoEditorComponent
  ],
})
export class SharedModule {}
