export interface StateMachineDefinition {
    initialState: string;
    states: State[];
}
export interface State {
    name: string;
    onEnter?: (context?: StateMachine) => void;
    onExit?: (context?: StateMachine) => void;
    transitions: Transition[];
}
export interface Transition {
    event: string;
    target: string;
    action?: (context?: StateMachine) => void;
}

export class StateMachine {
    private machineDef: StateMachineDefinition;
    private currentStateValue: string;

    constructor(stateMachineDefinitions: StateMachineDefinition) {
        this.machineDef = stateMachineDefinitions;
        this.currentStateValue = stateMachineDefinitions.initialState;
    }

    getCurrentState() {
        return this.currentStateValue;
    }

    transition(event: string): string | undefined {
        const currentStateDef: State | undefined = this.machineDef.states
            .find((state: State) => state.name === this.currentStateValue);

        if (currentStateDef === undefined) {
            console.log('This machine is not defined properly');
            return;
        }

        const destinationTransition: Transition | undefined = currentStateDef?.transitions
            .find((transition: Transition) => transition.event === event); 
        if (!destinationTransition) {
            console.log('This event is not defined for this state');
            return;
        }

        const destinationState: string = destinationTransition.target;
        const destinationStateDef: State | undefined = this.machineDef.states.find(state => state.name === destinationState);
        if (!destinationStateDef) {
            console.log('This destination state is not defined');
            return;
        }

        destinationTransition.action?.(this);
        currentStateDef?.onExit?.(this);
        destinationStateDef?.onEnter?.(this);

        this.currentStateValue = destinationState;

        return this.currentStateValue;
    }
}