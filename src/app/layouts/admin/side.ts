import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, Inject, type OnDestroy, type OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Subject, take, takeUntil } from 'rxjs';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import type { IMUser } from '@/interfaces/model';
import { SGlobal } from '@/services/global';
import { APP_NAME, KEY_ROLE, LINK } from '@/utils';
import { TFunction } from '@/utils/angular';
import type { IMenu } from './interface';

@Component({
  selector: '[LayoutAdminSide]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CommonModule, NzMenuModule, CSvgIcon],
  template: `
    <button class="logo" [ngClass]="{ active: (sGlobal.isCollapseMenu | async) }" (click)="handleGoDashboard()">
      <!-- <svg CSvgIcon [name]="EIcon.Logo"></svg> -->
      <img src="/assets/images/logo-ihp.png" alt="Example Image" class="h-auto w-64" />
      <h1 [ngClass]="{ active: (sGlobal.isCollapseMenu | async) }">{{ APP_NAME }}</h1>
    </button>
    <div className="scrollbar">
      <ul nz-menu nzMode="inline">
        <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: listMenu() }"></ng-container>
        <ng-template #menuTpl let-menus>
          @for (menu of menus; track menu) {
            @if (!menu.children) {
              <li
                nz-menu-item
                [nzPaddingLeft]="menu.level * 24"
                [nzDisabled]="menu.disabled"
                [nzSelected]="menu.selected"
                (click)="onSelect(menu)"
              >
                @if (menu.icon) {
                  <svg class="ant-menu-item-icon" CSvgIcon [name]="menu.icon" [size]="24"></svg>
                }
                <span>{{ t.instant(menu.label) }}</span>
              </li>
            } @else {
              <li
                nz-submenu
                [nzPaddingLeft]="menu.level * 24"
                [nzOpen]="menu.open"
                [nzDisabled]="menu.disabled"
                [nzTitle]="titleTpl"
                (click)="onSelect(menu)"
              >
                <ng-template #titleTpl>
                  @if (menu.icon) {
                    <svg class="ant-menu-item-icon" CSvgIcon [name]="menu.icon" [size]="24"></svg>
                  }
                  <span>{{ t.instant(menu.label) }}</span>
                </ng-template>
                <ul>
                  <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }" />
                </ul>
              </li>
            }
          }
        </ng-template>
      </ul>
    </div>
  `,
  styleUrl: './index.less',

  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class LayoutAdminSide implements OnDestroy, OnInit {
  EIcon = EIcon;
  APP_NAME = APP_NAME;

  constructor(
    @Inject(TranslateService) public t: TFunction,
    @Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>,
    @Inject(SGlobal) readonly sGlobal: SGlobal,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Menu';
  }
  readonly destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleGoDashboard = () => {
    this.sGlobal.language.pipe(takeUntil(this.destroyed$), take(1)).subscribe(language => {
      this.router.navigate([`/${language}${LINK.Dashboard}`]);
    });
  };

  user?: IMUser;
  ngOnInit(): void {
    this.sGlobal.user.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.user = user;
    });

    const node = document.createElement('div');
    node.setAttribute('class', 'overload');
    node.setAttribute('id', 'admin-side-overload');
    this.el.nativeElement.parentElement?.appendChild(node);

    this.sGlobal.isCollapseMenu.pipe(takeUntil(this.destroyed$)).subscribe(isCollapseMenu => {
      this.el.nativeElement.setAttribute('class', isCollapseMenu ? 'active' : '');
      document
        .getElementById('admin-side-overload')
        ?.setAttribute('class', !isCollapseMenu ? 'overload active' : 'overload');
    });
  }

  list: IMenu[] = [
    {
      key: LINK.Dashboard,
      icon: EIcon.Calendar,
      label: 'Dashboard',
    },
    {
      key: LINK.User,
      icon: EIcon.UserCircle,
      label: 'User',
      permission: KEY_ROLE.P_USER_INDEX,
      queryparams: { roleCode: 'SUPER-ADMIN' },
    },
    {
      key: LINK.Setting,
      icon: EIcon.Cog,
      label: 'Setting',
      children: [
        {
          key: LINK.Code,
          label: 'Code',
          permission: KEY_ROLE.P_CODE_INDEX,
          queryparams: { typeCode: 'POSITION' },
        },
        {
          key: LINK.Content,
          label: 'Content',
          permission: KEY_ROLE.P_CONTENT_INDEX,
          queryparams: { typeCode: 'VALUES' },
        },
        {
          key: LINK.Post,
          label: 'Post',
          permission: KEY_ROLE.P_POST_INDEX,
          queryparams: { typeCode: 'NEWS' },
        },
        {
          key: LINK.Parameter,
          label: 'Parameter',
          permission: KEY_ROLE.P_PARAMETER_INDEX,
          queryparams: { code: 'ADDRESS' },
        },
      ],
    },
  ];

  listMenu = computed(() =>
    this.list
      .filter(item => {
        return (
          !item.permission ||
          (!item.children && item.permission && this.user?.role?.permissions?.includes(item.permission)) ||
          (item.children &&
            item.children.filter(
              subItem => !subItem.permission || this.user?.role?.permissions?.includes(subItem.permission),
            ).length > 0)
        );
      })
      .map(item => ({
        ...item,
        label: item.label ?? '',
        children: item.children?.map(subItem => ({ ...subItem, label: subItem.label ?? '', level: 2 })),
      })),
  );

  /**
   * Finds a menu item by its key in the given array of menus.
   *
   * @param menus - The array of menus to search in.
   * @param key - The key of the menu item to find.
   * @returns The found menu item, or undefined if not found.
   */
  findMenu = (menus: IMenu[], key: string): IMenu | undefined => {
    let menuCurrent: IMenu | undefined;
    const forEachMenu = (menu: IMenu) => {
      if (menu.key === key) {
        menuCurrent = menu;
      } else if (menu.children) {
        menu.children.forEach(forEachMenu);
      }
    };
    menus.forEach(forEachMenu);
    return menuCurrent;
  };

  onSelect = ({ key, children }) => {
    const menu = this.findMenu(this.listMenu(), key);
    if (menu && !children) {
      this.sGlobal.language.pipe(takeUntil(this.destroyed$), take(1)).subscribe(language => {
        console.log(`/${language}${menu.key}`);
        this.router.navigate([`/${language}${menu.key}`], { queryParams: menu.queryparams });
      });
    }
  };
}
