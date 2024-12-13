import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

interface TableColumn {
  title: string;
  key?: string; // Key to map data
  rowspan?: number;
  colspan?: number;
  children?: TableColumn[]; // For nested headers
  filterable?: boolean;
  filters?: { text: string; value: string }[];
  filterFn?: (list: string[], item: any) => boolean;
  sortable?: boolean;
  sortFn?: (a: any, b: any) => number;
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [NzTableModule, NgFor, NgIf, NgClass],
  template: `
    <nz-table
      #reusableTable
      [nzData]="tableData"
      [nzBordered]="true"
      [nzSize]="'middle'"
      [nzPaginationPosition]="'bottom'"
      [nzShowPagination]="true"
      [nzPageSizeOptions]="[10, 20, 30]"
      [nzScroll]="{ x: scrollX, y: scrollY }"
      [nzNoResult]="'noDataMessage'"
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
        <tr *ngFor="let data of reusableTable.data">
          <ng-container *ngFor="let col of flattenedColumns">
            <td [nzEllipsis]="true" class="text-body" *ngIf="col.key">{{ data[col.key] }}</td>
          </ng-container>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [
    `
      /* Style for Parent Headers */
      .parent-header {
        background-color: #4caf50; /* Green */
        color: white;
        text-align: center;
        font-weight: bold;
        padding: 8px;
      }

      /* Style for Child Headers */
      .child-header {
        background-color: #f0f2f5; /* Light Gray */
        color: #000;
        text-align: center;
        font-weight: normal;
        padding: 8px;
      }
      .text-body {
        text-align: center;
      }
    `,
  ],
})
export class ReusableTableComponent implements OnInit {
  @Input() tableData: any[] = []; // Data for the table
  @Input() tableColumns: TableColumn[] = []; // Configurable column definitions
  @Input() scrollX: string = '300px'; // Horizontal scroll size
  @Input() scrollY: string = '500px'; // Vertical scroll size
  @Input() headerBackground: string = '#f0f2f5';
  @Input() parentHeaderBackground: string = '#4caf50';
  @Input() childHeaderBackground: string = '#f0f2f5';
  @Output() onEdit = new EventEmitter<Event>();
  headerRows: TableColumn[][] = []; // Processed header rows for rendering
  flattenedColumns: TableColumn[] = []; // Flattened columns for the table body

  ngOnInit(): void {
    this.processColumns();
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
