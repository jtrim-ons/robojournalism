import test from 'ava';
import robojournalism from './index.js';

test('title', t => {
	t.throws(() => {
		robojournalism(123);
	}, {
		instanceOf: TypeError,
		message: 'Expected a string, got number'
	});

	t.is(robojournalism('unicorns'), 'unicorns & rainbows');
});
