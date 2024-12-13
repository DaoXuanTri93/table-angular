import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  type OnInit,
  type TemplateRef,
} from '@angular/core';

@Component({
  selector: '[CEMask]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    <span *ngIf="addonBefore" class="before">
      <ng-container [ngTemplateOutlet]="addonBefore"></ng-container>
    </span>
    <input
      #input
      [type]="type"
      class="ant-input"
      [ngClass]="{ before: !!addonBefore, after: !!addonAfter, disabled: disabled }"
      [disabled]="disabled"
      [defaultValue]="value"
      [placeholder]="placeholder"
      (blur)="onBlur.emit($event)"
      (input)="onChange.emit($event)"
      (focus)="onFocus.emit($event)"
      (keyup.enter)="onPressEnter.emit($event)"
    />
    <span *ngIf="addonAfter" class="after">
      <ng-container [ngTemplateOutlet]="addonAfter"></ng-container>
    </span>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CEMask implements OnInit {
  @Input() mask: any;
  @Input() value?: string = '';
  @Input() disabled?: boolean;
  @Input() placeholder?: string = '';
  @Input() type?: string;
  @Input() addonBefore?: TemplateRef<unknown>;
  @Input() addonAfter?: TemplateRef<unknown>;

  @Output() onBlur = new EventEmitter<FocusEvent>();
  @Output() onChange = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onPressEnter = new EventEmitter<Event>();

  @ViewChild('input') input?: any;

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  ngOnInit(): void {
    setTimeout(() => {
      !!this.mask && !!this.input && Inputmask(this.mask).mask(this.input.nativeElement);
      this.el.nativeElement.setAttribute('class', 'relative');
    });
  }
}
