import { Node } from './Node';
import { NODE_ACTION } from '../interfaces/Enums';
import { Process } from './Process';
import { IExecution } from '../interfaces/engine';
import { Item } from '../engine/Item';
declare class ScriptTask extends Node {
    run(item: any): Promise<NODE_ACTION>;
    describe(): string[][];
}
/**
 *
 *      foo[method]();
 *
 *      await this.token.appDelegate[serviceName](data);
 *
 *
 *      service signature:
 *              output= service (input,context)
 */
declare class ServiceTask extends Node {
    get serviceName(): any;
    run(item: any): Promise<NODE_ACTION>;
    describe(): string[][];
}
declare class BusinessRuleTask extends ServiceTask {
    run(item: any): Promise<NODE_ACTION>;
}
declare class SendTask extends ServiceTask {
    get isCatching(): boolean;
}
declare class UserTask extends Node {
    start(item: Item): Promise<NODE_ACTION>;
    setAssignVal(item: any, attr: any, dateFormat?: boolean): void;
    evaluateExpr(item: any, attr: any): any;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
}
declare class ReceiveTask extends Node {
    get isCatching(): boolean;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
}
declare class SubProcess extends Node {
    childProcess: Process;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    start(item: any): Promise<NODE_ACTION>;
}
/**
 *
 * <callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />
 *
 * the called process need to call me back when done.
 *
 *  Scenario
 *      a process 'D1' element 'E' is a 'CallActivity' calling Definition 'D2'
 * steps:
 *
 *      1.  Item 'E': item start: start event is fired to prepare for input
 *      2.  Item 'E': item start: executing the call process passing input
 *      3.  If Process 'D2' is completed immediatly
 *              we continue, skip next steps
  *     4.  Process 'D1' goes on a wait state
 *      5.  When the process 'D2' is completed it calls 'executionEnded'
 *      6.  We continue with Item:Invoke
 *      7.  event 'end' is fired to handle output of the process
 *
 *
 *
 * */
declare class CallActivity extends Node {
    get calledElement(): any;
    get requiresWait(): boolean;
    get canBeInvoked(): boolean;
    static executionEnded(execution: IExecution): Promise<void>;
    start(item: any): Promise<NODE_ACTION>;
}
export { UserTask, ScriptTask, ServiceTask, BusinessRuleTask, SendTask, ReceiveTask, SubProcess, CallActivity };
