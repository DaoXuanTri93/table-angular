import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';

import type { EIcon } from '@/enums';

@Component({
  selector: '[CGridVirtualizer]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<svg:use [attr.href]="'/assets/images/sprite.svg#icon_' + name" />`,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CGridVirtualizer implements OnInit {
  @Input() name: EIcon; // Name of the icon ==> Required
  @Input() size?: number; // Size of the icon ==> Not required
  @Input() className?: string;
  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  ngOnInit(): void {
    if (this.className) this.el.nativeElement.setAttribute('class', this.className);
    if (this.size) {
      this.el.nativeElement.style.width = `${this.size}px`;
      this.el.nativeElement.style.height = `${this.size}px`;
    }
  }
}
