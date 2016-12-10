
const paths = [ '', '/' ];

let en = false;
setTimeout( () => en = true, 10000 );

export default function isEnabled() {
	return en;
	return paths.indexOf( window.location.pathname ) > -1;
}
