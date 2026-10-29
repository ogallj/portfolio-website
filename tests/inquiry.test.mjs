import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquiryHref } from '../src/lib/inquiry.mjs';

test('an inquiry opens an addressed email draft with the selected discipline and reply details', () => {
  const href = createInquiryHref({ name: '  Alex Kim  ', email: 'alex@example.com', topic: 'Software project', message: 'I would like to discuss a new storefront.' });
  const draft = new URL(href);
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'ogallo254@gmail.com');
  assert.equal(draft.searchParams.get('subject'), 'Software project inquiry — Alex Kim');
  assert.equal(draft.searchParams.get('body'), 'Hi Joshua,\n\nI would like to discuss a new storefront.\n\nFrom: Alex Kim\nReply to: alex@example.com');
});

test('user punctuation and header-like text stay inside the draft body', () => {
  const href = createInquiryHref({ name: 'A & B', email: 'alex+work@example.com', topic: 'Creative & marketing', message: 'Brand + product?\n&bcc=someone@example.com\nA story in Nairobi: 你好.' });
  const draft = new URL(href);
  assert.equal(draft.searchParams.has('bcc'), false);
  assert.equal(draft.searchParams.size, 2);
  assert.match(draft.searchParams.get('body'), /alex\+work@example\.com/);
  assert.match(draft.searchParams.get('body'), /你好/);
  assert.equal(draft.searchParams.get('subject'), 'Creative & marketing inquiry — A & B');
});

test('incomplete or invalid inquiries do not produce a draft', () => {
  const valid = { name: 'Alex', email: 'alex@example.com', topic: 'Opportunity', message: 'Hello Joshua' };
  assert.throws(() => createInquiryHref({ ...valid, name: ' ' }));
  assert.throws(() => createInquiryHref({ ...valid, email: 'not-an-email' }));
  assert.throws(() => createInquiryHref({ ...valid, topic: 'Unexpected' }));
  assert.throws(() => createInquiryHref({ ...valid, message: ' ' }));
});
