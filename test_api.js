const fs = require('fs');

async function testTwitter() {
  const accessToken = 'OUI5VWc1eVUydzRDZy1YM2FIRXBUczJrcmJqREN1ZzRVVjVxSVg3QXZnVm05OjE3ODU2NzMwMjUzMDQ6MTowOmF0OjE';
  const totalBytes = 1000;
  
  console.log("Testing Twitter INIT...");
  const initRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      command: "INIT",
      total_bytes: totalBytes.toString(),
      media_type: "image/jpeg",
      media_category: "tweet_image"
    })
  });
  
  console.log("Twitter status:", initRes.status);
  const text = await initRes.text();
  console.log("Twitter response:", text);
}

async function testLinkedIn() {
  const accessToken = 'AQXqDKsOumu_qQJz14c89Owegm4qzz_QPELnpWpp8uzIgA21VqxQQqxVJd_ZJmLnOUZ2kM3L8nt0cZdhqa-tw5TKwes5WM1nC6nkmkIrfYYONCV_P2Cd-cADEXFw9RrQfY4_iDqK3iIxbG2epvJRvg7X2Yc6srGs52e9A7CcjA6xziHzcjaj_QYknrEkYr4FgFfInfsLPk13-ekcf39gCXcrF00qGMrjigUNaWUBVxuD2iBe1Q4dDEyF9yxIGjTzzclj6pZL8vQhwUHDo3wVs70K-myzJBR7gmAzuu-ZlZzGbIQB2Ur8qgfvGTvjK4RpW1ZmL_eW6wzJIseFi_LBeHe7tXj-lA';
  
  console.log("Testing LinkedIn registerUpload...");
  const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: "urn:li:person:7mURZ-v_ZD",
        serviceRelationships: [
          { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }
        ]
      }
    })
  });
  
  console.log("LinkedIn status:", registerRes.status);
  const text = await registerRes.text();
  console.log("LinkedIn response:", text);
}

testTwitter().then(testLinkedIn).catch(console.error);
