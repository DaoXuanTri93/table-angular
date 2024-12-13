import { Component, Inject, type OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SGlobal } from './services/global';
import { KEY_DATA, LANGUAGE } from './utils';
export let message: NzMessageService;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; Copyright ©2024 Brycen Vietnam Co., Ltd.</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background-color: #f8f9fa;
      padding: 20px 0;
      text-align: center;
      border-top: 1px solid #e7e7e7;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }

    .footer p {
      margin: 0;
      color: #6c757d;
    }

    .footer nav a {
      color: #007bff;
      text-decoration: none;
      margin: 0 10px;
    }

    .footer nav a:hover {
      text-decoration: underline;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(NzMessageService) readonly message: NzMessageService,
    @Inject(SGlobal) readonly sGlobal: SGlobal,
    @Inject(TranslateService) readonly t: TranslateService,
    @Inject(Router) readonly router: Router,
    @Inject(NzI18nService) readonly i18n: NzI18nService,
  ) {
    // Setup theme
    localStorage.getItem('theme');
    this.i18n.setLocale(en_US);
    const themeSystem =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.querySelector('html')?.setAttribute('data-theme', localStorage.getItem('theme') ?? themeSystem);

    // Call api to update data in local storage by set false key name isLatest
    Object.keys(KEY_DATA).forEach(value => {
      const key = value as keyof typeof KEY_DATA;
      const local = JSON.parse(localStorage.getItem(KEY_DATA[key]) ?? '{}');
      if (!local.data) local.data = [];
      localStorage.setItem(KEY_DATA[key], JSON.stringify({ ...local, isLatest: false }));
    });
  }

  ngOnInit(): void {
    // set function call message ant design vue to global variable message
    message = this.message;

    // set default language by router
    this.sGlobal.setLanguage(LANGUAGE);
    this.t.setDefaultLang(LANGUAGE);
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) NProgress.start();
      if (event instanceof NavigationEnd) NProgress.done();
    });
  }
}
