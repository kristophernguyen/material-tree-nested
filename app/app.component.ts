import { ChangeDetectorRef, Component, Injectable, ViewChild, ViewEncapsulation } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import arrayTreeFilter from 'array-tree-filter';

/**
 * Node for game
 */
export class Employee {
  children: BehaviorSubject<Employee[]>;
  onHover: boolean;
  constructor(public name: string,public title: string, public employeeId:string, public joinDate: string,public directTotalCount:string,public imgUrl:string, children?: Employee[], public parent?: Employee) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}

/**
 * The list of games
 */
const TREE_DATA = [
  new Employee('Kristopher Nguyen', 'CEO', 'AA001', '01/01/1998', '1/5','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32',[
    new Employee('Vicky Nguyen', 'VP', 'AA002', '01/01/1998','4/5','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32', [
    new Employee('Madi Nguyen', 'Sr. Software Enginer', 'AA003', '01/01/1998', '0/0','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Kloe Nguyen', 'Sr. Software Enginer', 'AA004', '01/01/1998', '0/0','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Sophie Nguyen', 'Sr. Network Engineer', 'AA005', '01/01/1998','0/0', '//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Charlotte Nguyen', 'Sr. QA', 'AA006', '01/01/1998','0/0', '//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32')
  ])
  ]),
  new Employee('Kristopher Nguyen', 'CEO', 'AA001', '01/01/1998', '1/5','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32',[
    new Employee('Vicky Nguyen', 'VP', 'AA002', '01/01/1998','4/5','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32', [
    new Employee('Madi Nguyen', 'Sr. Software Enginer', 'AA003', '01/01/1998', '0/0','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Kloe Nguyen', 'Sr. Software Enginer', 'AA004', '01/01/1998', '0/0','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Sophie Nguyen', 'Sr. Network Engineer', 'AA005', '01/01/1998','0/0', '//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32'),
    new Employee('Charlotte Nguyen', 'Sr. QA', 'AA006', '01/01/1998','0/0', '//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32')
  ])
  ]),
  new Employee('Kristopher Nguyen', 'CEO', 'AA001', '01/01/1998', '1/5','//www.google.com/s2/u/0/photos/public/AIbEiAIAAABECLON17nn_Jmp1gEiC3ZjYXJkX3Bob3RvKigwNTU5Mzk1NDMwYTc3NWU2Mzc3MzFkMTRkNTBlMDJkOWE5ODQ3Y2MxMAFsSX2wBjU88ze9H1i9fZYZnmYUrQ?sz=32')
];
/**,
 * @title Nested tree
 */

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('mytree') mytree;
  searchKey: string;
  recursive: boolean = false;
  levels = new Map<Employee, number>();
  treeControl: NestedTreeControl<Employee>;
  nodehover: boolean;


  dataSource: MatTreeNestedDataSource<Employee>;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

    this.treeControl = new NestedTreeControl<Employee>(this.getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.dataSource.data = TREE_DATA;
    
  }
  mouseEnter(node) {
    console.log("mouse enter");
    node.onHover = true;
  }
  mouseLeave(node){
    node.onHover = false;
    console.log("mouse leave");

  }
  onSearchClick($event) {
    console.log("Running Search");
    if (this.searchKey && this.searchKey.length > 0) {

      const result = arrayTreeFilter(
        TREE_DATA, (item, level) => item.name.toLowerCase() === this.searchKey.toLowerCase()
      );
      if (result) {
        this.dataSource.data = result;
      }
    }
  }
  reset($event){
    this.dataSource.data = TREE_DATA
  }
  getChildren = (node: Employee) => {
    return node.children;
  };

  hasChildren = (index: number, node: Employee) => {
    return node.children.value.length > 0;
  }
  collapseAll(){
     this.mytree.treeControl.collapseAll();
  }
  expandAll(){
     this.mytree.treeControl.dataNodes = this.dataSource.data; 
     this.mytree.treeControl.expandAll();
  }
}
