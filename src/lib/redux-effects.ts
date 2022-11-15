import { Action as ReduxAction, Dispatch } from 'redux';

/** Super minimal algebraic effects for Redux */

type MiddlewareAPI<State, Action extends ReduxAction> = {
	getState(): State;
	dispatch(action: Action): void;
};
type Middleware<State, Action extends ReduxAction> = (
	store: MiddlewareAPI<State, Action>
) => (next: Dispatch<Action>) => (action: Action) => void;

export type Effect<State, Action extends ReduxAction> = (
	store: MiddlewareAPI<State, Action>
) => (action: Action) => void;

export namespace Effect {
	export function all<State, Action extends ReduxAction>(
		...effects: Effect<State, Action>[]
	): Effect<State, Action> {
		return (store: MiddlewareAPI<State, Action>) => {
			const actionEffects = effects.map((eff) => eff(store));

			return (action: Action) => {
				actionEffects.forEach((eff) => {
					eff(action);
				});
			};
		};
	}
}

export const effectsMiddleware =
	<State, Action extends ReduxAction>(
		rootEffect: Effect<State, Action>
	): Middleware<State, Action> =>
	(store: MiddlewareAPI<State, Action>) => {
		const eff = rootEffect(store);

		return (next: Dispatch<Action>) => (action: Action) => {
			next(action);
			eff(action);
		};
	};
