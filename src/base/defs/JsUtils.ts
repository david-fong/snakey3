
const NO_ENUM  = Object.freeze(<const>{ enumerable: false });
const NO_WRITE = Object.freeze(<const>{ writable: false });

export namespace JsUtils {
	/** Copied from TypeScript official docs. */
	export function applyMixins(derivedCtor: any, mixins: any[]): void {
		const inheritanceProps = Object.freeze(["constructor", "__proto__"]);
		mixins.forEach((baseCtor) => {
			Object.getOwnPropertyNames(baseCtor.prototype)
			.filter((name) => !(inheritanceProps.includes(name)))
			.forEach((name) => {
				Object.defineProperty(derivedCtor.prototype, name,
					Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!
				);
			});
		});
	}

	/** @requires obj must not contain cycles (circular references). */
	export function deepFreeze<T>(obj: T): TU.DeepRo<T> {
		_deepFreeze(obj);
		return obj as TU.DeepRo<T>;
	}
	function _deepFreeze(obj: any): void {
		for (const key of Object.getOwnPropertyNames(obj)) {
			const val = obj[key];
			if (typeof val === "object") {
				deepFreeze(val);
			}
		}
		Object.freeze(obj);
	}

	/**
	 */
	export function hasProp<T, K extends keyof T>(obj: T, key: K): boolean {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}

	/**
	 */
	export function protoNoEnum<T>(
		ctor: {new(...args: any[]): T} | Function, // <- allow abstract classes
		...propNames: TU.RoArr<keyof T & string> | TU.RoArr<string>
	): void {
		const hasProps = Object.freeze(Object.getOwnPropertyNames(ctor.prototype));
		propNames.forEach((propName) => {
			if (DEF.DevAssert) {
				if (!hasProps.includes(propName as string)) {
					const msg = `\`${ctor.name}\` prototype has no property named \"${propName}\"`;
					throw new TypeError(msg); // Mismatched property name.
				}
			}
			Object.defineProperty(ctor.prototype, propName, NO_ENUM);
		});
	}

	/**
	 */
	export function instNoEnum<T>(
		inst: T, ...propNames: TU.RoArr<keyof T & string> | TU.RoArr<string>
	): void {
		_configProp(inst, propNames, NO_ENUM);
	}
	/**
	 */
	export function propNoWrite<T>(
		inst: T, ...propNames: TU.RoArr<keyof T & string> | TU.RoArr<string>
	): void {
		_configProp(inst, propNames, NO_WRITE);
	}

	function _configProp<T>(
		inst: T, propNames: TU.RoArr<string>, descriptor: PropertyDescriptor,
	): void {
		const hasProps = Object.freeze(Object.getOwnPropertyNames(inst));
		propNames.forEach((propName) => {
			if (DEF.DevAssert) {
				if (!hasProps.includes(propName as string)) {
					const msg = `\`${(inst as any).__proto__.constructor.name}\``
					+ ` instance has no property named \"${propName}\"`;
					throw new TypeError(msg); // Mismatched property name.
				}
			}
			Object.defineProperty(inst, propName, descriptor);
		});
	}

	/** A non-user-facing markup utility. */
	export function prependComment(node: HTMLElement, commentStr: string): void {
		node.parentNode!.insertBefore(document.createComment(" " + commentStr + " "), node);
	}

	export type CamelCaseNameTransforms = Readonly<{
		spaceyLowercase: string;
		spaceyUppercase: string;
		spaceyCapitalized: string;
	}>;
	/**
	 * Nothing ultra fancy. Does not handle Acronyms.
	 */
	export function camelCaseTransforms(camelCaseName: string): CamelCaseNameTransforms {
		const spaceyLowercase = camelCaseName.replace(/[A-Z]/g, (letter) => " " + letter.toLowerCase());
		return Object.freeze(<CamelCaseNameTransforms>{
			spaceyLowercase,
			spaceyUppercase: spaceyLowercase.toUpperCase(),
			spaceyCapitalized: spaceyLowercase.split(' ').map((word) =>
				word.charAt(0).toUpperCase() + word.substring(1)
			).join(' '),
		});
	}

	/**
	 * A combiner for common operations surrounding `document.createElement`
	 * with some custom HTML attribute defaults.
	 *
	 * - Calls `Object.seal` immediately on the created HTMLElement.
	 * - If making a button, defaults the `type` to `button` instead of `submit`.
	 * - If making an anchor, defaults the rel to `noopener`.
	 *
	 * @param tagName -
	 * @param classNames -
	 * @param domProperties -
	 */
	export function mkEl<
		K extends keyof HTMLElementTagNameMap,
		V extends HTMLElementTagNameMap[K],
	>(
		tagName: K,
		classNames: Array<string>,
		domProperties: Readonly<Partial<V>> | undefined = undefined,
	): HTMLElementTagNameMap[K] {
		const el = document.createElement(tagName);
		try { Object.seal(el); } catch (e) {};
		if (classNames.length) {
			el.classList.add(...classNames);
		}

		if (tagName === "button") {
			(el as HTMLButtonElement).type = "button"; // instead of "submit".
		} else if (tagName === "a") {
			(el as HTMLAnchorElement).rel = "noopener";
			// ^ Should already be the default on modern browsers when
			// `target === "_blank"`, but it doesn't hurt to set it
			// anyway. We're going stricter too.
		}

		if (domProperties !== undefined) {
			Object.assign(el, domProperties);
		}
		return el;
	}

	/**
	 */
	export function adoptStyleSheet(root: Document | ShadowRoot, href: string): void {
		// if ("adoptedStyleSheets" in root) {
		// 	const sheet = Array.from(document.styleSheets).find((sheet) => sheet.href?.endsWith(href));
		// 	if (sheet !== undefined) {
		// 		// TODO.build remove this any-casting when adoptedStyleSheets
		// 		// stops being experimental and makes it into the DOM spec.
		// 		(root as any).adoptedStyleSheets = [sheet];
		// 		return;
		// 	}
		// }
		// The client's browser does not support adoptedStyleSheets :(
		root.appendChild(JsUtils.mkEl("link", [], {
			rel: "stylesheet",
			href: href,
		}));
	}
}
Object.freeze(JsUtils);