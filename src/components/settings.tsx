import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { toggleShowQuotes, resetHiddenQuotes, toggleBuiltinQuotes } from '../store/actions';

class Settings extends React.Component<any,any> {
	render() {
		const resetHiddenQuotes = ( e ) => {
			e.preventDefault();
			this.props.resetHiddenQuotes();
		}

		return (
			<form className="nfe-settings">
				<fieldset>
					<legend>
						<label>
							<input type="checkbox"
								checked={ this.props.quotesVisible }
								onChange={ this.props.toggleShowQuotes } />
							Show Quotes
						</label>
					</legend>

					<label>
						<input type="checkbox"
						 	disabled={ ! this.props.quotesVisible }
							checked={ this.props.builtinQuotesEnabled }
							onChange={ this.props.toggleBuiltinQuotes } />
						Enable Built-in Quotes 
					</label>
					{ this.props.hiddenQuoteCount > 0 &&
						<span className="nfe-settings-hidden-quote-count">
							&nbsp;({ this.props.hiddenQuoteCount } hidden
								- <a href="#" onClick={ resetHiddenQuotes }>Reset</a>)
						</span>
					}
					<p>
					{ this.props.customQuoteCount > 0 ?
						<label>{ this.props.customQuoteCount } custom quotes</label>
						: <label>
							You can now add your own custom quotes! Just click
							the arrow menu beside the quote text.
						</label>
					}
					</p>
				</fieldset>
			</form>
		);
	}
}

const mapStateToProps = ( state ) => ( {
	quotesVisible: state.showQuotes,
	builtinQuotesEnabled: state.builtinQuotesEnabled,
	hiddenQuoteCount: state.hiddenBuiltinQuotes.length,
	customQuoteCount: state.customQuotes.length,
} );

const mapDispatchToProps = ( dispatch ) => ( {
	toggleShowQuotes: () => dispatch( toggleShowQuotes() ),
	toggleBuiltinQuotes: () => dispatch( toggleBuiltinQuotes() ),
	resetHiddenQuotes: () => dispatch( resetHiddenQuotes() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( Settings );
