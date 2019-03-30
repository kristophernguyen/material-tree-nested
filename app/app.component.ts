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
  constructor(public name: string,public title: string, public employeeId:string, public joinDate: string, children?: Employee[], public parent?: Employee) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}

/**
 * The list of games
 */
const TREE_DATA = [
  new Employee('Kristopher Nguyen', 'CEO', 'IAA001', '01/01/1998', [
    new Employee('Vicky Nguyen', 'VP', 'IAA002', '01/01/1998', [
    new Employee('Madi Nguyen', 'CEO', 'IAA003', '01/01/1998'),
    new Employee('Kloe Nguyen', 'CEO', 'IAA004', '01/01/1998'),
    new Employee('Sophie Nguyen', 'CEO', 'IAA005', '01/01/1998'),
    new Employee('Charlotte Nguyen', 'CEO', 'IAA006', '01/01/1998')
  ])
  ])
];
/**
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
  search($event) {
    console.log("Running Search");
    if (this.searchKey && this.searchKey.length > 0) {

      const result = arrayTreeFilter(
        TREE_DATA, (item, level) => item.item.toLowerCase() === this.searchKey.toLowerCase()
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
