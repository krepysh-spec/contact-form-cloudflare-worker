# Contact Form with Cloudflare Worker and Resend API

![Contact Form Preview](img/preview.jpg)

[Read post on Medium](https://medium.com/@yevheniimykhailichenko/819e4cf0baa7)

## Why Use Resend for Email?

Resend is a simple, fast, and free email API service designed to make sending transactional emails, such as contact form submissions, incredibly easy. It allows you to quickly send emails without the need to worry about setting up or maintaining your own email servers.

### **Resend Free Tier Features**:
- **100 emails per day** (Daily Limit)
- **3,000 emails per month** (Monthly Limit)
- **4 sender addresses** available for use
- **No credit card required** to get started

This repository contains a **serverless function** that processes contact form submissions. It validates the input data and sends an email via **Resend**, making it a simple, efficient, and cost-free solution for handling contact forms.

## How It Works

This Cloudflare Worker:
1. Accepts `POST` requests with form data in JSON format.
2. Validates the provided input (name, email, phone, subject, message).
3. Sends an email via **Resend API**.
4. Returns a JSON response confirming success or showing validation errors.

## Deploying on Cloudflare Workers

### **1. Set Up Cloudflare Workers**
- Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
- Navigate to **Workers & Pages** → **Create a Service**
- Choose **HTTP Handler**
- Select **Quick Edit**

### **2. Configure Environment Variables**
Cloudflare Workers allow environment variables to be configured in the dashboard.
Go to **Settings** → **Variables** and add:

| Variable Name       | Description                     |
|---------------------|--------------------------------|
| `RESEND_API_KEY`   | Your Resend API key            |
| `RESEND_FROM`      | Sender email address           |
| `RESEND_TO`        | Recipient email address        |

### **3. Deploy the Worker**
- Copy and paste the Worker code into Cloudflare’s editor.
- Click **Save and Deploy**.

## Example Request

You can test the deployed Worker using **cURL**, **JavaScript fetch API**, or **Postman**.

### **cURL Command**
```bash
curl -X POST https://your-worker-subdomain.workers.dev/contact-form \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "johndoe@example.com",
       "phone": "+1234567890",
       "subject": "Test Message",
       "message": "Hello, this is a test message sent via Cloudflare Worker!"
     }'
```

### **JavaScript (fetch API)**
```javascript
async function sendFormData() {
  const response = await fetch("https://your-worker-subdomain.workers.dev/contact-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "+1234567890",
      subject: "Test Message",
      message: "Hello, this is a test message sent via Cloudflare Worker!"
    }),
  });

  const result = await response.json();
  console.log(result);
}

sendFormData();
```

### **Expected Responses**
#### ✅ **Success Response:**
```json
{
  "status": "success",
  "message": "Email sent successfully!"
}
```

#### ❌ **Validation Error Response:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "data": {
    "fields": {
      "email": "Invalid email format"
    }
  }
}
```

#### ❌ **Missing API Key Response:**
```json
{
  "status": "error",
  "message": "Service error"
}
```

## Full Worker Code
You can find the full code in this repository. The worker is already set up and ready to deploy with Cloudflare Workers and Resend.

## Conclusion
This Cloudflare Worker provides an easy, **serverless solution** for handling contact form submissions and sending emails via **Resend**. No backend setup is needed—just deploy the worker and configure your API keys.

🚀 **Start using Resend for free and integrate it with Cloudflare Workers today!**