import test from 'ava';
import createText from './index.js';

test('title', t => {
	t.throws(() => {
		createText(123);
	}, {
		instanceOf: TypeError,
		message: 'Expected a string, got number'
	});

	t.is(createText('{a}', {a: 'b'}), 'b');
	t.is(createText('{a?b:c}', {a: true}), 'b');
	t.is(createText('{a?b:c}', {a: false}), 'c');
	t.is(createText('{a?{b}:{c}}', {a: true, b: 'x', c: 'y'}), 'x');
	t.is(createText('{a?{b}:{c}}', {a: false, b: 'x', c: 'y'}), 'y');
});
