import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'sr-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() displayEditor!: boolean;
  @Input() profilePic!: string;
  @Output() close = new EventEmitter();
  @Output() croppedPic = new EventEmitter<string>();

  imageChangedEvent: any = '';
  canvasRotation: any = '';
  transform: ImageTransform = {};
  showCropper: boolean = false;
  croppedImage: any = '';
  scale = 1;

  hasProfilePic!: boolean;

  @HostListener('window:keydown.+', ['$event'])
  handleAddKey(event: KeyboardEvent) {
    this.zoomIn();
  }

  @HostListener('window:keydown.-', ['$event'])
  handleSubKey(event: KeyboardEvent) {
    this.zoomOut();
  }

  constructor() { }

  ngOnInit(): void {
    if (this.profilePic) {
      this.hasProfilePic = true;
    }
  }

  closeEditor() {
    this.close.emit();
  }

  fileSelected(event: any) {
    if (event) {
      this.imageChangedEvent = event;
      this.hasProfilePic = false;
    }
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    }
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    }
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    }
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    }
  }

  reset() {
    this.canvasRotation = 0;
    this.transform = {};
    this.scale = 1;
  }

  save() {
    this.croppedPic.emit(this.croppedImage);
    this.closeEditor();
  }

  cancel() {
    const input = document.querySelector('input');
    input!.value = '';
    this.reset();
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.closeEditor();
  }

  private flipAfterRotate() {
    const flipH = this.transform.flipH;
    const flipV = this.transform.flipV;

    this.transform = {
      ...this.transform,
      flipH,
      flipV
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.displayEditor = true;
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
  }

  loadImageFailed() {
    console.error('System error! Try choosing a different file.');
  }

}
