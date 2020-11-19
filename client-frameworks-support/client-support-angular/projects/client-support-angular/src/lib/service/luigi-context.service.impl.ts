import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import {
  Context,
  addInitListener,
  addContextUpdateListener
} from '@luigi-project/client';
import {
  IContextMessage,
  ILuigiContextTypes,
  LuigiContextService
} from './luigi-context-service';

@Injectable({
  providedIn: 'root'
})
export class LuigiContextServiceImpl implements LuigiContextService {
  private subject: ReplaySubject<IContextMessage> = new ReplaySubject<
    IContextMessage
  >(1);
  private currentContext: IContextMessage;

  constructor() {
    addInitListener(initContext => {
      this.addListener(ILuigiContextTypes.INIT, initContext);
    });
    addContextUpdateListener(updateContext => {
      this.addListener(ILuigiContextTypes.UPDATE, updateContext);
    });
  }

  public contextObservable(): Observable<IContextMessage> {
    return this.subject.asObservable();
  }

  /**
   * Get latest context object retrieved from luigi core application or none, if not yet set.
   */
  public getContext(): Context {
    return this.currentContext && this.currentContext.context;
  }

  /**
   * Set current context
   */
  protected setContext(obj: IContextMessage): void {
    this.currentContext = obj;
    this.subject.next(obj);
  }

  addListener(contextType: ILuigiContextTypes, context: Context) {
    this.setContext({
      contextType,
      context
    } as IContextMessage);
  }
}