const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

const db = admin.firestore();

const apiKey = "FL_0a978e78c83d9f65c928d9dea599048d";
const headers = {
  "Content-Type": "application/json",
  "api-key": apiKey,
};

const tellephantHeaders = {
  "Content-Type": "application/json",
  // apiKey: "OQZdDMewqwQGMLlgGwVGa4uKmUOYtQFOVEtoVQsFKhSh8UJ9mE6pGTOkL3kJ",
};

exports.onTakeQuizLeadCreated = functions.firestore
  .document("takeQuizLeads/{docId}")
  .onCreate(async (snap, context) => {
    const newValue = snap.data();
    const { name, email, phone, waMessagePhone } = newValue;

    try {
      // Step 1: Create Member
      const createMemberResponse = await createMember(
        name,
        email,
        waMessagePhone
      );
      console.log("Member Created:", createMemberResponse);

      // Step 2: Enroll Member
      const enrollMemberResponse = await enrollMember(email);
      console.log("Member Enrolled:", enrollMemberResponse);

      // Step 3: Send WhatsApp Message
      const whatsappResponse = await sendEnrollWaMessage(name, waMessagePhone);
      console.log("WhatsApp Message Sent:", whatsappResponse);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  exports.onMasterclassNewLead = functions.firestore
    .document("masterclassLeads/{docId}")
    .onCreate(async (snap, context) => {
      const newValue = snap.data();
      const { name, email, waMessagePhone } = newValue;

      try {
        
        const whatsappResponse = await sendMasterclassWaMessage(
          name,
          waMessagePhone
        );
        console.log("WhatsApp Message Sent:", whatsappResponse);
      } catch (error) {
        console.error("Error:", error);
      }
    });


async function sendMasterclassWaMessage(name, phone) {
  const apiUrl = "https://api.tellephant.com/v1/send-message";
  const body = {
    "Content-Type": "application/json",
    apikey: "OQZdDMewqwQGMLlgGwVGa4uKmUOYtQFOVEtoVQsFKhSh8UJ9mE6pGTOkL3kJ",
    to: phone,
    channels: ["whatsapp"],
    whatsapp: {
      contentType: "template",
      template: {
        templateId: "xskills",
        language: "en",
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "media",
                media: {
                  type: "image",
                  url: "https://cdn.shopify.com/s/files/1/0270/0342/0758/files/25_4ad6e716-7234-4589-9f49-3c02c69f1818.png?v=1722253760",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: name,
              },
            ],
          },
        ],
      },
    },
  };
  // const response = await fetch(apiUrl, {
  await fetch(apiUrl, {
    method: "POST",
    headers: tellephantHeaders,
    body: JSON.stringify(body),
  }).then(response => response.json()).then(json => console.log(json));
}



async function sendEnrollWaMessage(name, phone) {
  const apiUrl = "https://api.tellephant.com/v1/send-message";
  const body = {
    "Content-Type": "application/json",
    apikey: "OQZdDMewqwQGMLlgGwVGa4uKmUOYtQFOVEtoVQsFKhSh8UJ9mE6pGTOkL3kJ",
    to: phone,
    channels: ["whatsapp"],
    whatsapp: {
      contentType: "template",
      template: {
        templateId: "xskills",
        language: "en",
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "media",
                media: {
                  type: "image",
                  url: "https://cdn.shopify.com/s/files/1/0270/0342/0758/files/25_4ad6e716-7234-4589-9f49-3c02c69f1818.png?v=1722253760",
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: name,
              },
            ],
          },
        ],
      },
    },
  };
  // const response = await fetch(apiUrl, {
  await fetch(apiUrl, {
    method: "POST",
    headers: tellephantHeaders,
    body: JSON.stringify(body),
  }).then(response => response.json()).then(json => console.log(json));
}
