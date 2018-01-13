import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { toggleShowQuotes, resetHiddenQuotes, toggleBuiltinQuotes } from '../store/actions';

const preventDefaultThen = f => ( e ) => {
	e.preventDefault();
	f();
}

interface Props {
	quotesVisible: boolean;
	builtinQuotesEnabled: boolean;
	hiddenQuoteCount: number;
	customQuoteCount: number;

	toggleShowQuotes: () => void;
	toggleBuiltinQuotes: () => void;
	resetHiddenQuotes: () => void;
}

const Settings = (props:Props) => {
	return (
		<form className="nfe-settings">
			<fieldset>
				<legend>
					<label>
						<input type="checkbox"
							checked={ props.quotesVisible }
							onChange={ props.toggleShowQuotes } />
						Show Quotes
					</label>
				</legend>

				<label>
					<input type="checkbox"
						disabled={ ! props.quotesVisible }
						checked={ props.builtinQuotesEnabled }
						onChange={ props.toggleBuiltinQuotes } />
					Enable Built-in Quotes 
				</label>
				{ props.hiddenQuoteCount > 0 &&
					<span className="nfe-settings-hidden-quote-count">
						&nbsp;({ props.hiddenQuoteCount } hidden
							- <a href="#" onClick={ preventDefaultThen(props.resetHiddenQuotes) }>Reset</a>)
					</span>
				}
				<p>
				{ props.customQuoteCount > 0 ?
					<label>{ props.customQuoteCount } custom quotes</label>
					: <label>
						You can now add your own custom quotes! Just click
						the arrow menu beside the quote text.
					</label>
				}
				</p>
			</fieldset>
		</form>
	);
};

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
