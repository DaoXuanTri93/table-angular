import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';

@Component({
  selector: '[CEPassword]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, CSvgIcon],
  template: `
    <input
      autoComplete="on"
      [type]="state.toggle ? 'password' : 'text'"
      class="ant-input pr-9"
      [disabled]="disabled"
      [defaultValue]="value"
      [placeholder]="placeholder"
      (blur)="onBlur.emit($event)"
      (input)="onChange.emit($event)"
    />
    <button type="button" class="icon" (click)="state.toggle = !state.toggle">
      <svg CSvgIcon [name]="state.toggle ? EIcon.EyeSlash : EIcon.Eye" class="icon"></svg>
    </button>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CEPassword implements OnInit {
  EIcon = EIcon;
  @Input() mask: any;
  @Input() value?: string = '';
  @Input() disabled?: boolean;
  @Input() placeholder?: string = '';
  @Input() type?: string;

  @Output() onBlur = new EventEmitter<FocusEvent>();
  @Output() onChange = new EventEmitter<Event>();

  state = {
    toggle: true,
  };

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.el.nativeElement.setAttribute('class', 'relative');
    });
  }
}
