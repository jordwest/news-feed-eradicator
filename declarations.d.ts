import "solid-js";

// Augment the solid-js JSX namespace
declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			// Add your custom element name here and combine its attributes
			"nfe-tabs": SolidJSX.IntrinsicElements["div"];
		}
	}
}

