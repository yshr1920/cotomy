import Layout from '@theme/Layout';
import React, {useEffect, useState} from 'react';

export default function ContactPage(): React.JSX.Element {
  const [pageUrl, setPageUrl] = useState('https://cotomy.net/contact/');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  return (
    <Layout title="Contact">
      <main className="container margin-vert--lg">
        <h1>Contact</h1>

        <form className="contact-form" action="https://formspree.io/f/mbdadved" method="POST">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" type="text" name="name" required />

          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" name="email" required />

          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" required />

          <input type="hidden" name="page_url" value={pageUrl} />
          <input type="hidden" name="_next" value="https://blog.cotomy.net/thanks/" />
          <input type="hidden" name="_subject" value="Blog Contact" />
          <input type="hidden" name="_redirect" value="/thanks/" />

          <button type="submit">Send</button>
        </form>

        <p className="contact-privacy">
          <a href="/privacy-policy/">Privacy Policy</a>
        </p>
      </main>
    </Layout>
  );
}
