import * as React from 'react';
import { connect } from 'react-redux';
import { currentQuote } from '../store/selectors';
import { compose } from 'redux';
import {
	removeCurrentQuote,
	selectNewQuote,
	addQuote,
	startEditing,
	cancelEditing,
	menuHide,
	menuToggle,
	setQuoteText,
	setQuoteSource,
	ActionObject
} from '../store/actions';
import { IState } from '../store/reducer';

const MenuItem = ( props ) => {
	const action = ( e ) => {
		e.preventDefault();
		props.onClick();
	}

	return <li>
		<a href="#"
		onClick={ action }
		className="nfe-quote-action-menu-item">
			{ props.children }
		</a>
	</li>
}

interface IEditingPanelProps {
	onCancel: () => void
	onSave: (text: string, source: string) => void

	state: IState;
	dispatch: (action:ActionObject) => void;
}

const EditingPanel = (props:IEditingPanelProps) => {
	const text = props.state.editingText;
	const source = props.state.editingSource;
	const { dispatch, onCancel } = props;

	const onChangeText = ( e ) => {
		dispatch(setQuoteText(e.target.value))
	}

	const onChangeSource = ( e ) => {
		dispatch(setQuoteSource(e.target.value))
	}

	const onSave = () => {
		props.onSave( text, source );
	}
	return <div>
		<p className="nfe-quote-text">
			<textarea
				placeholder="Quote"
				value={ text }
				className="nfe-editor-quote"
				onChange={ onChangeText }
				autoFocus={ true }></textarea>
		</p>
		<p className="nfe-quote-source">
			~ <input type="text"
				placeholder="Source"
				value={ source }
				onChange={ onChangeSource }
				className="nfe-editor-source" />
		</p>
		<div>
			<button className="nfe-button" onClick={ onCancel }>Cancel</button>
			<button className="nfe-button nfe-button-primary" onClick={ onSave }>Save</button>
		</div>
	</div>
}

const passState = ( state: IState ) => ({ state })
const passDispatch = ( dispatch: (action:ActionObject) => any ) => ({ dispatch })

const ConnectedEditingPanel = connect(passState, passDispatch)(EditingPanel)

interface IQuoteDisplayProps {
	quoteId: number;
	text: string;
	source: string;
	isMenuVisible: boolean;
	isEditing: boolean;

	removeQuote: () => void,
	selectNewQuote: () => void,
	addQuote: (text: string, source: string) => void,
	startEditing: () => void,
	stopEditing: () => void,
	hideMenu: () => void,
	toggleMenu: () => void,
}

const QuoteDisplay = (props:IQuoteDisplayProps) => {
	const hideMenu = ( e = null ) => {
		e && e.preventDefault();
		props.hideMenu();
	}
	const toggleMenu = ( e = null ) => {
		e && e.preventDefault();
		props.toggleMenu();
	}

	const removeQuote = () => {
		hideMenu();
		props.removeQuote();
	}

	const selectNewQuote = () => {
		hideMenu();
		props.selectNewQuote();
	}

	const editNewQuote = () => {
		hideMenu();
		props.startEditing();
	}

	const cancelEdit = () => {
		props.stopEditing();
	}

	const saveQuote = ( text, source ) => {
		props.addQuote( text, source );
		props.stopEditing();
	}

	return (
		<div className="nfe-quote">
			<div className="nfe-quote-action-menu">
				<a href="#" className="nfe-quote-action-menu-button" onClick={ toggleMenu }>▾</a>
				{ props.isMenuVisible && ! props.isEditing &&
					<div className="nfe-quote-action-menu-content">
						<ul>
							<MenuItem onClick={ removeQuote }>Remove this quote</MenuItem>
							<MenuItem onClick={ selectNewQuote }>See another quote</MenuItem>
							<MenuItem onClick={ editNewQuote }>Enter custom quote...</MenuItem>
						</ul>
					</div>
				}
			</div>
			{ props.isEditing ? 
				<ConnectedEditingPanel
					onCancel={ cancelEdit }
					onSave={ saveQuote } /> :
				<div>
					<p className="nfe-quote-text">“{ props.text }”</p>
					<p className="nfe-quote-source">~ { props.source }</p>
				</div>
			}
		</div>
	);
}

const mapStateToProps = ( state : IState ) => {
	const quote = currentQuote( state );
	return {
		quoteId: quote && quote.id,
		text: quote && quote.text,
		source: quote && quote.source,
		isEditing: state.isEditingQuote,
		isMenuVisible: state.isQuoteMenuVisible
	}
};

const mapDispatchToProps = ( dispatch ) => ( {
	removeQuote: compose( dispatch, removeCurrentQuote ),
	selectNewQuote: compose( dispatch, selectNewQuote ),
	addQuote: compose( dispatch, addQuote ),
	startEditing: compose( dispatch, startEditing ),
	stopEditing: compose( dispatch, cancelEditing ),
	hideMenu: compose( dispatch, menuHide ),
	toggleMenu: compose( dispatch, menuToggle ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( QuoteDisplay );
