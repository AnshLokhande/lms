import { google } from 'googleapis';

export async function POST(req, res) {
  const data = await req.json();
  try {
    const credentials = {
      client_email: process.env.GOOGLE_SHEET_CUSTOM_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEET_CUSTOM_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_CUSTOM_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          data.fullName,
          data.email,
          data.contact,
          data.stream,
          data.qualification,
          data.amount,
          data.paymentId,
          data.orderId,
          new Date().toLocaleString(),
        ]],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
