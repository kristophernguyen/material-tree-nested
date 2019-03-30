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
export class GameNode {
  children: BehaviorSubject<GameNode[]>;
  onHover: boolean;
  constructor(public item: string, children?: GameNode[], public parent?: GameNode) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}

/**
 * The list of games
 */
const TREE_DATA = [
  new GameNode('Simulation', [
    new GameNode('Factorio'),
    new GameNode('Oxygen not included'),
  ]),
  new GameNode('Indie', [
    new GameNode(`Don't Starve`, [
      new GameNode(`Region of Giants`),
      new GameNode(`Together`),
      new GameNode(`Shipwrecked`)
    ]),
    new GameNode('Terraria'),
    new GameNode('Starbound'),
    new GameNode('Dungeon of the Endless')
  ]),
  new GameNode('Action', [
    new GameNode('Overcooked')
  ]),
  new GameNode('Strategy', [
    new GameNode('Rise to ruins')
  ]),
  new GameNode('RPG', [
    new GameNode('Magicka', [
      new GameNode('Magicka 1'),
      new GameNode('Magicka 2')
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
  levels = new Map<GameNode, number>();
  treeControl: NestedTreeControl<GameNode>;
  nodehover: boolean;


  dataSource: MatTreeNestedDataSource<GameNode>;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

    this.treeControl = new NestedTreeControl<GameNode>(this.getChildren);
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
  getChildren = (node: GameNode) => {
    return node.children;
  };

  hasChildren = (index: number, node: GameNode) => {
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
