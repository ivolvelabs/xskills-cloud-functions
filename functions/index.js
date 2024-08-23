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
      console.log(snap.data());

    const { name, email, phone, countryCode } = newValue;

    try {
      // // Step 1: Create Member
      // const createMemberResponse = await createMember(
      //   name,
      //   email,
      //   phone
      // );
      // console.log("Member Created:", createMemberResponse);

      // // Step 2: Enroll Member
      // const enrollMemberResponse = await enrollMember(email);
      // console.log("Member Enrolled:", enrollMemberResponse);

      // Step 3: Send WhatsApp Message
      const waMessagePhone = `${countryCode}${phone}`;
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
      console.log(snap.data());
      const { name, email, phone, countryCode } = newValue;

      try {
        // Step 1: Create Member
      const createMemberResponse = await createMember(
        name,
        email,
        phone
      );
      console.log("Member Created:", createMemberResponse);

      // Step 2: Enroll Member
      const enrollMemberResponse = await enrollMember(email);
      console.log("Member Enrolled:", enrollMemberResponse);
      const waMessagePhone = `${countryCode}${phone}`;
        const whatsappResponse = await sendMasterclassWaMessage(
          name,
          waMessagePhone
        );
        console.log("WhatsApp Message Sent:", whatsappResponse);
      } catch (error) {
        console.error("Error:", error);
      }
    });


async function createMember(fullname, email, mobile) {
    const apiUrl = 'https://api.freshlearn.com/v1/integration/member';
    const body = {
        "email": email,
        "fullName": fullname,
        "phone": mobile,
        "source": "cubelelo-xskills-website"
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Error creating member: ${response.statusText}`);
    }

    return await response.json();
}

async function enrollMember(email) {
    const apiUrl = 'https://api.freshlearn.com/v1/integration/member/enroll';
    const body = {
        "courseId": 167932,
        "planId": 12825,
        "memberEmail": email,
        "reference": "xskills_trial_course",
        "source": "cubelelo",
        "transactionId": "xskills_trial_course"
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });



    if (!response.ok) {
        throw new Error(`Error enrolling member: ${response.statusText}`);
    }

    return await response.json();
}



async function sendMasterclassWaMessage(name, phone) {
  console.log("phone", phone);
  const apiUrl = "https://api.tellephant.com/v1/send-message";
  const body = {
    "Content-Type": "application/json",
    apikey: "OQZdDMewqwQGMLlgGwVGa4uKmUOYtQFOVEtoVQsFKhSh8UJ9mE6pGTOkL3kJ",
    to: phone,
    channels: ["whatsapp"],
    whatsapp: {
      contentType: "template",
      template: {
        templateId: "xskills_trial_course_new",
        language: "en",
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "media",
                media: {
                  type: "image",
                  url: "https://cdn.shopify.com/s/files/1/0270/0342/0758/files/unnamed_8_d1aada13-d971-4995-8b9a-e0f71d09dfa3.png?v=1723200575",
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
        templateId: "xskills_quiz_new",
        language: "en",
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "media",
                media: {
                  type: "image",
                  url: "https://cdn.shopify.com/s/files/1/0270/0342/0758/files/unnamed_9_2aa191cd-e37e-4498-a53f-7fdab690e94d.png?v=1723205223",
18.png?v=1722253760",
: tellephantHeaders,
    body: JSON.stringify(body),
  }).then(response => response.json()).then(json => console.log(json));
}
