import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CGridVirtualizer } from '@/components/grid-virtualizer';
import { Filter } from '@/components/grid-virtualizer/filter';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services/global';
import { TFunction } from '@/utils/angular';
@Component({
  selector: 'page-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, Filter, CGridVirtualizer],
  template: `
    <div class="intro-x">
      Dashbaord
      <button Filter></button>
    </div>
    <div CGridVirtualizer [name]="EIcon.Home">table</div>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }, SGlobal],
})
export class PageDashboard {
  EIcon = EIcon;
  constructor() {}
}
