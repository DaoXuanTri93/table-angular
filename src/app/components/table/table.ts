import { EIcon } from '@/enums';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CSvgIcon } from '../svg-icon';
interface TableColumn {
  title?: string;
  key?: string; // Key to map data
  rowspan?: number;
  colspan?: number;
  children?: TableColumn[]; // For nested headers
  clickable?: boolean;
  icon?: EIcon;
  fixLeft?: boolean;
  leftPosition?: string;
}

@Component({
  selector: '[app-reusable-table]',
  standalone: true,
  imports: [NzTableModule, NgFor, NgIf, NgClass, NzIconModule, CSvgIcon, NzToolTipModule],
  template: `
    <nz-table
      #reusableTable
      [nzData]="tableData"
      [nzBordered]="true"
      [nzSize]="'middle'"
      [nzPaginationPosition]="'bottom'"
      [nzShowPagination]="true"
      [nzScroll]="{ x: scrollX, y: scrollY }"
      [nzTableLayout]="'fixed'"
    >
      <!-- Dynamic Table Header -->
      <thead>
        <tr *ngFor="let headerRow of headerRows">
          <ng-container *ngFor="let col of headerRow">
            <th
              [ngClass]="{
                'parent-header': !col.children,
                'child-header': col.children,
              }"
              [nzLeft]="col.fixLeft ? col.leftPosition || '0px' : false"
              [nzAlign]="'center'"
              [style.background-color]="col.children ? childHeaderBackground : parentHeaderBackground"
              [attr.rowspan]="col.rowspan || 1"
              [attr.colspan]="col.colspan || 1"
            >
              {{ col.title }}
            </th>
          </ng-container>
        </tr>
      </thead>

      <!-- Dynamic Table Body -->
      <tbody>
        <tr *ngIf="reusableTable.data.length === 0">
          <td colspan="50"></td>
        </tr>
        <tr *ngFor="let data of reusableTable.data">
          <ng-container *ngFor="let col of flattenedColumns">
            <td
              class="text-body ellipsis-cell"
              *ngIf="col.key"
              [nzLeft]="col.fixLeft ? col.leftPosition || '0px' : false"
              (click)="col.clickable ? onCellClick(data, col.key) : null"
              [nz-tooltip]="data[col.key]"
            >
              <span class="flex justify-center"
                >{{ data[col.key] }}
                <svg *ngIf="col.icon" CSvgIcon [name]="col.icon" [size]="20"></svg>
              </span>
            </td>
          </ng-container>
        </tr>
      </tbody>
    </nz-table>
  `,
  styleUrl: './index.less',
})
export class ReusableTableComponent implements OnInit {
  EIcon = EIcon;
  @Input() tableData: any[] = []; // Data for the table
  @Input() tableColumns: TableColumn[] = []; // Configurable column definitions
  @Input() scrollX: string; // Horizontal scroll size
  @Input() scrollY: string; // Vertical scroll size
  @Input() headerBackground: string = '#f0f2f5';
  @Input() parentHeaderBackground: string = '#4caf50';
  @Input() childHeaderBackground: string = '#f0f2f5';
  @Output() onEdit = new EventEmitter<Event>();
  @Output() onCellClickEvent = new EventEmitter<{ data: any; key: string }>(); // Emit cell click event
  headerRows: TableColumn[][] = []; // Processed header rows for rendering
  flattenedColumns: TableColumn[] = []; // Flattened columns for the table body

  ngOnInit(): void {
    this.processColumns();
  }
  onCellClick(data: any, key: string): void {
    this.onCellClickEvent.emit({ data, key });
  }
  /**
   * Process column configurations to support nested headers.
   */
  private processColumns(): void {
    const [headerRows, flattenedColumns] = this.generateHeaderRows(this.tableColumns);
    this.headerRows = headerRows;
    this.flattenedColumns = flattenedColumns;
  }

  /**
   * Generate header rows and flatten columns for rendering.
   * @param columns Array of TableColumn definitions.
   * @param level Current level of headers (for recursive processing).
   */
  private generateHeaderRows(columns: TableColumn[], level: number = 0): [TableColumn[][], TableColumn[]] {
    const headerRows: TableColumn[][] = [];
    const flattenedColumns: TableColumn[] = [];
    const queue: { col: TableColumn; level: number }[] = columns.map(col => ({ col, level }));

    while (queue.length) {
      const { col, level } = queue.shift()!;
      if (!headerRows[level]) {
        headerRows[level] = [];
      }

      headerRows[level].push(col);

      if (col.children && col.children.length > 0) {
        queue.push(...col.children.map(child => ({ col: child, level: level + 1 })));
      } else {
        flattenedColumns.push(col);
      }
    }

    return [headerRows, flattenedColumns];
  }
}
