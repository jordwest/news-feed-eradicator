import * as React from 'react';
import { connect } from 'react-redux';
import { currentQuote } from '../store/selectors';
import { compose } from 'redux';
import { removeCurrentQuote, selectNewQuote, addQuote } from '../store/actions';

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

class EditingPanel extends React.Component<any,any> {
	constructor() {
		super();
		this.state = { text: "", source: "" };
	}

	render() {
		const { text, source } = this.state;
		const { onCancel } = this.props;

		const onChangeText = ( e ) => {
			this.setState( { text: e.target.value } );
		}

		const onChangeSource = ( e ) => {
			this.setState( { source: e.target.value } );
		}

		const onSave = () => {
			this.props.onSave( this.state.text, this.state.source );
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
}

class QuoteDisplay extends React.Component<any,any> {
	constructor() {
		super();
		this.state = {
			isMenuVisible: false,
			isEditing: false,
			editingText: "",
			editingSource: "",
		};
	}

	render() {
		const toggleMenu = ( e = null ) => {
			e && e.preventDefault();
			this.setState( {
				isMenuVisible: ! this.state.isMenuVisible,
			} );
		}

		const removeQuote = () => {
			toggleMenu();
			this.props.removeQuote();
		}

		const selectNewQuote = () => {
			toggleMenu();
			this.props.selectNewQuote();
		}

		const editNewQuote = () => {
			toggleMenu();
			this.setState( { isEditing: true } );
		}

		const cancelEdit = () => {
			this.setState( { isEditing: false } );
		}

		const saveQuote = ( text, source ) => {
			this.setState( { isEditing: false } );
			this.props.addQuote( text, source );
		}

		return (
			<div className="nfe-quote">
				<div className="nfe-quote-action-menu">
					<a href="#" className="nfe-quote-action-menu-button" onClick={ toggleMenu }>▾</a>
					{ this.state.isMenuVisible && ! this.state.isEditing &&
						<div className="nfe-quote-action-menu-content">
							<ul>
								<MenuItem onClick={ removeQuote }>Remove this quote</MenuItem>
								<MenuItem onClick={ selectNewQuote }>See another quote</MenuItem>
								<MenuItem onClick={ editNewQuote }>Enter custom quote...</MenuItem>
							</ul>
						</div>
					}
				</div>
				{ this.state.isEditing ? 
					<EditingPanel
						onCancel={ cancelEdit }
						onSave={ saveQuote } /> :
					<div>
						<p className="nfe-quote-text">“{ this.props.text }”</p>
						<p className="nfe-quote-source">~ { this.props.source }</p>
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = ( state ) => {
	const quote = currentQuote( state );
	return {
		quoteId: quote && quote.id,
		text: quote && quote.text,
		source: quote && quote.source,
	}
};

const mapDispatchToProps = ( dispatch ) => ( {
	removeQuote: compose( dispatch, removeCurrentQuote ),
	selectNewQuote: compose( dispatch, selectNewQuote ),
	addQuote: compose( dispatch, addQuote ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( QuoteDisplay );
