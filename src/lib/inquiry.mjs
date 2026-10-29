export function createInquiryHref({ name = '', email = '', topic = '', message = '' } = {}) {
  const values = { name: name.trim(), email: email.trim(), topic: topic.trim(), message: message.trim() };
  if (!values.name || !values.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    throw new Error('Please add your name, a valid email address, and a message.');
  }
  if (!['Software project', 'Creative & marketing', 'Opportunity', 'Something else'].includes(values.topic)) {
    throw new Error('Please choose what you would like to discuss.');
  }
  const subject = `${values.topic} inquiry — ${values.name}`;
  const body = `Hi Joshua,\n\n${values.message}\n\nFrom: ${values.name}\nReply to: ${values.email}`;
  return `mailto:ogallo254@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
