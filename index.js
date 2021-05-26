const createText = (template, dict) => {
	//
	// TODO: < and >
	//

	// This is based on Douglas Crockford's old json_parse https://github.com/douglascrockford/JSON-js/blob/03157639c7a7cddd2e9f032537f346f1a87c0f6d/json_parse.js

	if (typeof template !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof template}`);
	}

	let at = 1;
	let ch = template.charAt(0);

	const getCh = function () {
		// Just to keep xo happy
		return ch;
	};

	const error = function (m) {
		throw JSON.stringify({
			name: 'Robo-journalist error',
			message: m,
			at,
			text: template
		});
	};

	const next = function (c) {
		// If a c parameter is provided, verify that it matches the current character.
		if (c && c !== ch) {
			error('Expected \'' + c + '\' instead of \'' + ch + '\'');
		}

		// Get the next character. When there are no more characters,
		// return the empty string.
		ch = template.charAt(at);
		at += 1;
		return ch;
	};

	const getValue = function (key) {
		if (!(key in dict)) {
			error(`${key} is not a key of the data dictionary.`);
		}

		return dict[key];
	};

	const eitherOr = function (which) {
		next('?');
		const first = parse();
		next(':');
		const second = parse();
		next('}');
		return which ? first : second;
	};

	const braced = function () {
		next('{');
		if (ch === ':') {
			// {:} adds a colon to the output
			next(':');
			next('}');
			return ':';
		}

		let varName = '';
		while (getCh()) {
			if (ch === '}') {
				next('}');
				return getValue(varName);
			}

			if (ch === '?') {
				return eitherOr(getValue(varName));
			}

			varName += ch;
			next();
		}

		error('Braces not closed');
	};

	const parse = function () {
		let result = '';
		while (getCh()) {
			if (ch === ':' || ch === '}') {
				return result;
			}

			if (ch === '{') {
				result += braced();
				continue;
			}

			result += ch;
			next();
		}

		return result;
	};

	const result = parse();
	if (ch !== '') {
		error(`Didn't expect '${ch}'`);
	}

	return result;
};

export default createText;
