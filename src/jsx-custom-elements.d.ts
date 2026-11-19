/// <reference types="vite/client" />
import type { JSX } from "@solidjs/web";

declare module "@solidjs/web" {
	namespace JSX {
		interface IntrinsicElements {
			"nfe-tabs": JSX.HTMLAttributes<HTMLElement>;
		}
	}
}
