// Match3Events.ts

import Phaser from 'phaser';
import { ICellData } from './Match3Game';

export interface ICellClickEventData {
  col: number;
  row: number;
  cellData: ICellData;
}

export interface IMatchEventData {
  amount: number;
  cellData: ICellData[];
}

export interface INoMatchEventData {
  cells: ICellData[];
}

export interface IDeadlockEventData {
  data?: object;
  // Additional data can be added here
}

interface IMatch3EventsProps {
  scene: Phaser.Scene;
  eventPrefix?: string;
}

export class Match3Events {
  private scene: Phaser.Scene;
  private eventPrefix: string;

  constructor({ scene, eventPrefix = 'match3_event_' }: IMatch3EventsProps) {
    this.scene = scene;
    this.eventPrefix = eventPrefix;
  }

  emitCellClick(data: ICellClickEventData) {
    this.scene.events.emit(this.eventPrefix + 'cellClick', data);
  }

  onCellClick(callback: (data: ICellClickEventData) => void) {
    this.scene.events.on(this.eventPrefix + 'cellClick', callback);
  }

  emitMatch(data: IMatchEventData) {
    this.scene.events.emit(this.eventPrefix + 'match', data);
  }

  onMatch(callback: (data: IMatchEventData) => void) {
    this.scene.events.on(this.eventPrefix + 'match', callback);
  }

  emitNoMatch(data: INoMatchEventData) {
    this.scene.events.emit(this.eventPrefix + 'noMatch', data);
  }

  onNoMatch(callback: (data: INoMatchEventData) => void) {
    this.scene.events.on(this.eventPrefix + 'noMatch', callback);
  }

  emitDeadlock(data: IDeadlockEventData) {
    this.scene.events.emit(this.eventPrefix + 'deadlock', data);
  }

  onDeadlock(callback: (data: IDeadlockEventData) => void) {
    this.scene.events.on(this.eventPrefix + 'deadlock', callback);
  }
}
