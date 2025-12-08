const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

async function uploadToDrive(filePath, fileName) {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../config/service-account.json"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const drive = google.drive({ version: "v3", auth });

  // Upload file
  const response = await drive.files.create({
    requestBody: { name: fileName },
    media: {
      mimeType: "video/mp4",
      body: fs.createReadStream(filePath),
    },
    fields: "id",
  });

  const fileId = response.data.id;

  // Make file public
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  // Get public links
  const fileData = await drive.files.get({
    fileId,
    fields: "id, webContentLink, webViewLink",
  });

  return {
    id: fileData.data.id,
    downloadUrl: fileData.data.webContentLink,
    viewUrl: fileData.data.webViewLink,
  };
}

module.exports = uploadToDrive;
