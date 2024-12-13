import { CommonModule } from '@angular/common';
import { Component, Inject, type OnDestroy, type OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subject, take, takeUntil } from 'rxjs';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services/global';
import { APP_NAME, LINK } from '@/utils';
import { TFunction } from '@/utils/angular';
import { LayoutAdminSide } from './side';

@Component({
  selector: 'layout-admin',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CommonModule, RouterOutlet, NzMenuModule, NzDropDownModule, LayoutAdminSide, CSvgIcon],
  template: `
    <div class="l-admin">
      <aside LayoutAdminSide></aside>
      <section>
        <header>
          <button class="hamburger" (click)="handleCollapseMenu()">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </button>
          <div class="right">
            <button nz-dropdown nzTrigger="click" [nzDropdownMenu]="language">
              <svg CSvgIcon [name]="$any(sGlobal.language | async)" [size]="24" class="rounded-lg"></svg>
            </button>
            <nz-dropdown-menu #language="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item *ngIf="(sGlobal.language | async) !== 'en'">
                  <button (click)="changeLanguage('en')">
                    <svg CSvgIcon [name]="EIcon.En" [size]="24" class="rounded-lg"></svg>
                    English
                  </button>
                </li>
                <li nz-menu-item *ngIf="(sGlobal.language | async) !== 'vi'">
                  <button (click)="changeLanguage('vi')">
                    <svg CSvgIcon [name]="EIcon.Vi" [size]="24" class="rounded-lg"></svg>
                    Tiếng Việt
                  </button>
                </li>
              </ul>
            </nz-dropdown-menu>
            <button (click)="changeTheme()">
              <svg CSvgIcon [name]="EIcon.DayNight" [size]="24"></svg>
            </button>

            <div class="leading-none" nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
              <p class="text-sm font-semibold">{{ (sGlobal.user | async)?.name }}</p>
              <span class="text-xs text-base-content/40">{{ (sGlobal.user | async)?.email }}</span>
            </div>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.MyProfile, { tab: 'MyProfile' })">
                    <svg CSvgIcon [name]="EIcon.UserCircle" [size]="20"></svg>
                    {{ t.instant('MyProfile') }}
                  </button>
                </li>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.MyProfile, { tab: 'MyProfile' })">
                    <svg CSvgIcon [name]="EIcon.Key" [size]="20"></svg>
                    {{ t.instant('ChangePassword') }}
                  </button>
                </li>
                <li nz-menu-item>
                  <button (click)="changePage(LINK.Login)">
                    <svg CSvgIcon [name]="EIcon.Out" [size]="20"></svg>
                    {{ t.instant('SignOut') }}
                  </button>
                </li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </header>
        <main class="scrollbar">
          <router-outlet></router-outlet>
        </main>
      </section>
    </div>
  `,
  styleUrl: './index.less',

  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class LayoutAdmin implements OnDestroy, OnInit {
  EIcon = EIcon;
  LINK = LINK;
  APP_NAME = APP_NAME;

  constructor(
    @Inject(TranslateService) public t: TFunction,
    @Inject(SGlobal) readonly sGlobal: SGlobal,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Layouts';
  }
  readonly destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {}

  handleCollapseMenu = () => {
    this.sGlobal.isCollapseMenu.pipe(takeUntil(this.destroyed$), take(1)).subscribe(isCollapseMenu => {
      this.sGlobal.set({ isCollapseMenu: !isCollapseMenu });
    });
  };

  changeTheme = () => {
    const html = document.querySelector('html');
    const dataTheme = html?.getAttribute('data-theme');
    const theme = dataTheme === 'light' ? 'dark' : 'light';
    html?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  changeLanguage = lang => {
    const path = this.router.url.replace(/^\/[a-z]{2}/, `/${lang}`);
    this.t.use(lang);
    this.sGlobal.setLanguage(lang);
    this.router.navigate([path], { replaceUrl: true });
  };

  changePage = (link: string, queryParams?: any) => {
    console.log('vao day', link);
    console.log('queryParams', queryParams);
    return this.sGlobal.language.pipe(takeUntil(this.destroyed$), take(1)).subscribe(language => {
      this.router.navigate([`/${language}${link}`], { queryParams });
    });
  };
}
