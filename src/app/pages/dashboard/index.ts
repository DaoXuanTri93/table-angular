import { Component, computed, Inject, type OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BreadcrumbsComponent } from '@/components/breadcrumbs/breadcrumbs.component';
import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { ReusableTableComponent } from '@/components/table/table';
import { EButtonSize, EFormType, EIcon } from '@/enums';
import { SProject } from '@/services/projects';
import { TFunction } from '@/utils/angular';
import { CommonModule } from '@angular/common';
import type { Observable } from 'rxjs';

@Component({
  selector: 'page-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CButton, CForm, BreadcrumbsComponent, CForm, ReusableTableComponent, CommonModule],
  template: `
    <div class="intro-x p-5">
      <div>
        <app-breadcrumbs
          title="Summary of quality values of Trancom project"
          [list]="['Project Managerment', 'Summary of quality values']"
        ></app-breadcrumbs>
        <form CForm [columns]="columns()" [footer]="footer" [isEnterSubmit]="true" (onSubmit)="handleSubmit($event)">
          <ng-template #footer let-canSubmit="canSubmit" let-form="form">
            <div class="flex justify-between">
              <div class="flex flex-row gap-2">
                <button
                  CButton
                  [size]="EButtonSize.Small"
                  [text]="'Add'"
                  (click)="form.handleSubmit()"
                  [disabled]="!canSubmit()"
                ></button>
                <button
                  CButton
                  [size]="EButtonSize.Small"
                  [text]="'Export Excel'"
                  (click)="form.handleSubmit()"
                  [disabled]="!canSubmit()"
                ></button>
              </div>
              <div class="flex flex-row gap-2">
                <button
                  CButton
                  [size]="EButtonSize.Small"
                  [text]="'Search'"
                  (click)="handleSearch(form.getFieldValue('Phase'))"
                ></button>
                <button
                  CButton
                  [size]="EButtonSize.Small"
                  [text]="'Clear'"
                  (click)="form.handleSubmit()"
                  [disabled]="!canSubmit()"
                ></button>
              </div>
            </div>
          </ng-template>
        </form>
      </div>
      <div
        app-reusable-table
        [tableData]="listOfData"
        [tableColumns]="columnss"
        [parentHeaderBackground]="'#006241'"
        [childHeaderBackground]="'#cce0d9'"
        [scrollY]="'500px'"
        (onCellClickEvent)="handleCellClick($event)"
      ></div>
    </div>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }, SProject],
})
export class PageDashboard implements OnInit {
  EButtonSize = EButtonSize;
  data$: Observable<any>;
  dataProject: any = {};
  constructor(
    @Inject(TranslateService) readonly t: TFunction,
    @Inject(SProject) readonly sProject: SProject,
  ) {
    console.log('1');

    // this.listOfData = Array.from({ length: 100 }, (_, i) => ({
    //   edit: ``,
    //   project: `${i == 2 ? 1 : 2}`,
    //   workContent: `Content ${i}`,
    //   mainHours: Math.floor(Math.random() * 100),
    //   value: Math.random().toFixed(2),
    //   action1: `Action ${i}-1`,
    //   action2: `Action ${i}-2`,
    // }));
  }
  columns = computed(() => [
    {
      name: 'Phase',
      title: 'Phase',
      formItem: {
        col: 4,
        type: EFormType.Select,
        list: [
          { label: 'Value 11', value: '1' },
          { label: 'Value 22', value: '2' },
          { label: 'Value 33', value: '3' },
        ],
      },
    },
    {
      name: 'Assignee',
      title: 'Assignee',
      formItem: {
        col: 4,
        type: EFormType.Select,
        list: [
          { label: 'Value 12312312312', value: '1' },
          { label: 'Value 23231231', value: '2' },
          { label: 'Value 23232', value: '3' },
        ],
      },
    },
    {
      name: 'Project',
      title: 'Project',
      formItem: {
        col: 4,
        type: EFormType.Select,
        list: [
          { label: 'Value 12312312312', value: '1' },
          { label: 'Value 23231231', value: '2' },
          { label: 'Value 23232', value: '3' },
        ],
      },
    },
  ]);

  handleCellClick(event: { data: any; key: string }): void {
    console.log('Cell clicked:', event);
  }

  handleSubmit = ({ value }) => {
    // this.data$ = this.sGlobal.data;
    // this.sGlobal.data.subscribe(item => (this.dataProject = item.data));
    // console.log('dataProject', this.dataProject);
    console.log('value', value);
  };

  handleSearch = value => {
    console.log('search', value);
  };

  ngOnInit(): void {
    // this.sGlobal.getAll();
    this.sProject.fetchProjects();
    console.log('dataPost', this.sProject.data);

    // this.listOfData = dataPost.map(item => item);
    this.listOfData = Array.from({ length: 100 }, (_, i) => ({
      edit: ``,
      project: `${i == 2 ? 1 : 2}`,
      workContent: `Content ${i}`,
      mainHours: Math.floor(Math.random() * 100),
      value: Math.random().toFixed(2),
      action1: `Action ${i}-1`,
      action2: `Action ${i}-2`,
    }));
  }

  listOfData: any[] = [];
  columnss = [
    {
      title: 'Edit',
      key: 'edit',
      rowspan: 2,
      clickable: true,
      icon: EIcon.Edit,
      fixLeft: true,
    },
    {
      title: 'Project',
      key: 'project',
      rowspan: 2,
      clickable: false,
      fixLeft: true,
      leftPosition: '100px',
    },
    {
      title: 'WorkContent',
      key: 'workContent',
      rowspan: 2,
    },
    {
      title: 'Manager',
      colspan: 2,
      children: [
        { title: 'Man-hours', key: 'Man-hours', rowspan: 2 },
        { title: 'Refenceny', key: 'Refenceny', rowspan: 2 },
      ],
    },
    {
      title: 'Requered',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: '@@@@@@@@@@@@@@@@@@@@@@', key: 'value1' },
        { title: 'Value2', key: 'Value2' },
        { title: 'Value3', key: 'value3' },
        { title: 'Value4', key: 'value4' },
        { title: 'Value5', key: 'value5' },
        { title: 'Value6', key: 'value6' },
        { title: 'Value7', key: 'value7' },
        { title: 'Value8', key: 'value8' },
        { title: 'Value9', key: 'value9' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
    {
      title: 'Requered@@@@',
      colspan: 10,
      children: [
        { title: 'Main Hours', key: 'mainHours' },
        { title: 'Value11', key: 'value11' },
        { title: 'Value21', key: 'Value21' },
        { title: 'Value31', key: 'value31' },
        { title: 'Value41', key: 'value41' },
        { title: 'Value51', key: 'value51' },
        { title: 'Value61', key: 'value61' },
        { title: 'Value71', key: 'value71' },
        { title: 'Value81', key: 'value81' },
        { title: 'Value91Valu', key: 'value91' },
      ],
    },
  ];
}
