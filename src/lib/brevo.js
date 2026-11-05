import axios from 'axios';

export const sendEmail = async (to, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@temple.org';
  const senderName = process.env.BREVO_SENDER_NAME || 'Sri Venkateswara Swamy Temple';

  if (!apiKey) {
    console.warn('Brevo API key not configured. Skipping email.');
    return;
  }

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending email via Brevo:', error.response?.data || error.message);
    throw error;
  }
};
