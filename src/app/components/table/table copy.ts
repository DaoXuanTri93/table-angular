import { Component, type OnInit } from '@angular/core';

import { NzTableModule } from 'ng-zorro-antd/table';
interface ItemData {
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

@Component({
  selector: 'nz-demo-table-grouping-columns',
  standalone: true,
  imports: [NzTableModule],
  template: `
    <nz-table #groupingTable [nzData]="listOfData" nzBordered nzSize="middle" [nzScroll]="{ x: '1200px', y: '400px' }">
      <thead>
        <tr>
          <th rowspan="4" [nzFilters]="filterName" [nzFilterFn]="nameFilterFn">Edit</th>
          <th rowspan="4">Project</th>
          <th rowspan="4">Work Content</th>
          <th colSpan="2">Manager</th>
          <th colSpan="5">Requirement</th>
          <th colSpan="5">Requirement5555</th>
          <th colSpan="4">Action</th>
          <th colSpan="4">Action1</th>
        </tr>
        <tr>
          <th rowSpan="3">Main-hours</th>
          <th rowSpan="3">value</th>
          <th rowSpan="3">1</th>
          <th rowSpan="3">2</th>
          <th rowSpan="3">3</th>
          <th rowSpan="3">4</th>
          <th rowSpan="3">5</th>
          <th rowSpan="3">5</th>
          <th rowSpan="3">6</th>
          <th rowSpan="3">7</th>
          <th rowSpan="3">8</th>
          <th rowSpan="3">9</th>
          <th rowSpan="3">6</th>
          <th rowSpan="3">7</th>
          <th rowSpan="3">8</th>
          <th rowSpan="3">9</th>
          <th rowSpan="3">6</th>
          <th rowSpan="3">7</th>
          <th rowSpan="3">8</th>
          <th rowSpan="3">9</th>
        </tr>
      </thead>
      <tbody>
        @for (data of groupingTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.street }}</td>
            <td>{{ data.building }}</td>
            <td>{{ data.number }}</td>
            <td>{{ data.companyAddress }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.gender }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.companyName }}</td>
            <td>{{ data.gender }}</td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
})
export class NzDemoTableGroupingColumnsComponent implements OnInit {
  listOfData: ItemData[] = [];
  sortAgeFn = (a: ItemData, b: ItemData): number => a.age - b.age;
  nameFilterFn = (list: string[], item: ItemData): boolean => list.some(name => item.name.indexOf(name) !== -1);
  filterName = [
    { text: 'Joe', value: 'Joe' },
    { text: 'John', value: 'John' },
  ];

  ngOnInit(): void {
    const data: ItemData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: 'John Brown' + i,
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
      });
    }
    this.listOfData = data;
  }
}
