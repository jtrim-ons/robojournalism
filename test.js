import test from 'ava';
import createText from './index.js';

const regionThe = place => (place === 'Wales' || place === 'London') ? place : 'The ' + place;

test('title', t => {
	t.throws(() => {
		createText(123);
	}, {
		instanceOf: TypeError,
		message: 'Expected a string, got number'
	});

	t.is(createText('{a}', {a: 'b'}), 'b');
	t.is(createText('{a.b}', {a: {b: 123}}), '123');
	t.is(createText('{a?b:c}', {a: true}), 'b');
	t.is(createText('{a?b:c}', {a: false}), 'c');
	t.is(createText('{a?{b}:{c}}', {a: true, b: 'x', c: 'y'}), 'x');
	t.is(createText('{a?{b}:{c}}', {a: false, b: 'x', c: 'y'}), 'y');
	t.is(createText('{1 2 +}', {}), '3');
	t.is(createText('{a b +}', {a: 1, b: 2}), '3');
	t.is(createText('{a 3 -}', {a: 10}), '7');
	t.is(createText('{a 0 <?yes:no}', {a: 1}), 'no');
	t.is(createText('{a 0 <?yes:no}', {a: -1}), 'yes');
	t.is(createText('{a 0 <=?yes:no}', {a: 1}), 'no');
	t.is(createText('{a 0 <=?yes:no}', {a: 0}), 'yes');
	t.is(createText('{a 0 <=?yes:no}', {a: -1}), 'yes');
	t.is(createText('{a 0 ===?yes:no}', {a: 0}), 'yes');
	t.is(createText('{a 0 ===?yes:no}', {a: 5}), 'no');
	t.is(createText('{a ,}', {a: 3}), '3');
	t.is(createText('{a ,}', {a: 12345}), '12,345');
	t.is(createText('{a .-2}', {a: 149}), '100');
	t.is(createText('{a .-2}', {a: 150}), '200');
	t.is(createText('{a .-2}', {a: 151}), '200');
	t.is(createText('{a .-2}', {a: -149}), '-100');
	t.is(createText('{a .-2}', {a: -150}), '-200');
	t.is(createText('{a .-2}', {a: -151}), '-200');
	t.is(createText('{a .-1}', {a: 114}), '110');
	t.is(createText('{a .-1}', {a: 115}), '120');
	t.is(createText('{a .-1}', {a: 116}), '120');
	t.is(createText('{a .-1}', {a: -114}), '-110');
	t.is(createText('{a .-1}', {a: -115}), '-120');
	t.is(createText('{a .-1}', {a: -116}), '-120');
	t.is(createText('{a .0}', {a: 1.234}), '1');
	t.is(createText('{a .1}', {a: 1.234}), '1.2');
	t.is(createText('{a .1 ,}', {a: 1001.234}), '1,001.2');
	t.is(createText('{a .2}', {a: 1.236}), '1.24');
	t.is(createText('{a ~abs}', {a: 3}), '3');
	t.is(createText('{a ~abs}', {a: -3}), '3');
	t.is(createText('{0 ~word}', {}), '0');
	t.is(createText('{1 ~word}', {}), 'one');
	t.is(createText('{9 ~word}', {}), 'nine');
	t.is(createText('{10 ~word}', {}), '10');
	t.is(createText('{a ~word}', {a: 5.5}), '5.5');
	t.is(createText('{1 ~aan}', {}), 'a 1');
	t.is(createText('{11 ~aan}', {}), 'an 11');
	t.is(createText('{18 ~aan}', {}), 'an 18');
	t.is(createText('{8 ~aan}', {}), 'an 8');
	t.is(createText('{8 ~word ~aan}', {}), 'an eight');
	t.is(createText('{18 ~word ~aan}', {}), 'an 18');
	t.is(createText('{700 ~aan}', {}), 'a 700');
	t.is(createText('{800 ~aan}', {}), 'an 800');
	t.is(createText('{1 ~ord}', {}), 'first');
	t.is(createText('{23 ~ord}', {}), '23rd');
	t.is(createText('{a ~ord}', {a: 1}), 'first');
	t.is(createText('{a ~ord}', {a: 23}), '23rd');
	t.is(createText('the {1 ~ord\'}highest', {}), 'the highest');
	t.is(createText('the {23 ~ord\'}highest', {}), 'the 23rd highest');
	t.is(createText('the {a ~ord\'}highest', {a: 1}), 'the highest');
	t.is(createText('the {a ~ord\'}highest', {a: 23}), 'the 23rd highest');
	t.is(createText('{name \'}', {name: 'James'}), 'James\'');
	t.is(createText('{name \'}', {name: 'Alice'}), 'Alice\'s');
	t.is(createText('{place ^regionThe}', {place: 'Wales', regionThe}), 'Wales');
	t.is(createText('{place ^regionThe}', {place: 'North East', regionThe}), 'The North East');
	t.is(createText('a{:}b', {}), 'a:b');
	t.is(createText('a{?}b', {}), 'a?b');
	t.is(createText('a{x?{:}:{?}}b', {x: true}), 'a:b');
	t.is(createText('a{x?{:}:{?}}b', {x: false}), 'a?b');
});
