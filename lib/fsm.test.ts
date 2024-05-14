import { StateMachine, StateMachineDefinition, State, Transition } from './fsm';



const stateMachineDefMock: StateMachineDefinition = {
    initialState: 'idle',
    states: [
        {
            name: 'idle',
            transitions: [
                {
                    event: 'start',
                    target: 'running'
                }
            ],
            onEnter: (context?: StateMachine) => {
                console.log('Entering idle state');
            },
            onExit: (context?: StateMachine) => {
                console.log('Exiting idle state');
            }
        },
        {
            name: 'running',
            transitions: [
                {
                    event: 'stop',
                    target: 'idle'
                }
            ]
        }
    ]
};

describe('State machine library', () => {
    describe('State machine basic behavior', () => {

        it ('should be able to create a state machine', () => {        
            const stateMachine = new StateMachine(stateMachineDefMock);
            expect(stateMachine).toBeInstanceOf(StateMachine);
        });

        it ('should be able to get the current state', () => {
            const stateMachine = new StateMachine(stateMachineDefMock);
            expect(stateMachine.getCurrentState()).toEqual('idle');
        });

        it ('should be able to transition to a new state', () => {
            const stateMachine = new StateMachine(stateMachineDefMock);
            stateMachine.transition('start');
            expect(stateMachine.getCurrentState()).toEqual('running');
        });

        it ('should be able to transition back to the initial state', () => {
            const stateMachine = new StateMachine(stateMachineDefMock);
            stateMachine.transition('start');
            stateMachine.transition('stop');
            expect(stateMachine.getCurrentState()).toEqual('idle');
        });

        it ('should be able to handle an invalid event', () => {
            const stateMachine = new StateMachine(stateMachineDefMock);
            stateMachine.transition('start');
            stateMachine.transition('invalid');
            expect(stateMachine.getCurrentState()).toEqual('running');
        });

        it ('should be able to handle an invalid state', () => {
            const stateMachine = new StateMachine(stateMachineDefMock);
            stateMachine.transition('start');
            stateMachine.transition('stop');
            stateMachine.transition('stop');
            expect(stateMachine.getCurrentState()).toEqual('idle');
        });

        it ('should be able to handle an invalid state machine', () => {
            const stateMachine = new StateMachine({
                initialState: 'invalid',
                states: []
            });
            stateMachine.transition('start');
            expect(stateMachine.getCurrentState()).toEqual('invalid');
        });
    });
    
    describe('State machine on enter and on exit behavior', () => {
        const stateMachineDefMockWithSpy: StateMachineDefinition = stateMachineDefMock;
        const onEnterIdleSpy = jest.fn();
        const onExitIdleSpy = jest.fn();
        const onEnterRunningSpy = jest.fn();
        const onExitRunningSpy = jest.fn();

        beforeAll(() => {
            stateMachineDefMockWithSpy.states[0].onEnter = onEnterIdleSpy;
            stateMachineDefMockWithSpy.states[0].onExit = onExitIdleSpy;
            stateMachineDefMockWithSpy.states[1].onEnter = onEnterRunningSpy;
            stateMachineDefMockWithSpy.states[1].onExit = onExitRunningSpy;
        });
        
        it ('should run correct onExit and onEnter functions', () => {
            const stateMachine = new StateMachine(stateMachineDefMockWithSpy);
            stateMachine.transition('start');
            expect(onExitIdleSpy).toHaveBeenCalled();
            expect(onEnterRunningSpy).toHaveBeenCalled();
        });

        it ('should not run irrelevant onExit and onEnter functions', () => {
            const stateMachine = new StateMachine(stateMachineDefMockWithSpy);
            stateMachine.transition('start');
            expect(onExitRunningSpy).not.toHaveBeenCalled();
            expect(onEnterIdleSpy).not.toHaveBeenCalled();
        });

        xit ('should first run onExit, then onEnter and then change the value of the current state', () => {
            // to be implemented
        });
    });
});