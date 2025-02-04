export default {
    async fetch(request, env) {
        
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ status: "error", message: "Method Not Allowed" }), {
                status: 405,
                headers: { "Content-Type": "application/json" },
            });
        }

        let data;

        try {
            data = await request.json();
        } catch (err) {
            return new Response(JSON.stringify({ status: "error", message: "Invalid JSON" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { name, email, phone, subject, message } = data;

        const errors = {};
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name || typeof name !== "string" || name.length < 2 || name.length > 100) {
            errors.name = "Invalid name (2-100 chars required)";
        }

        if (!email || !isValidEmail(email)) {
            errors.email = "Invalid email format";
        }

        if (phone && (typeof phone !== "string" || phone.length < 6 || phone.length > 20)) {
            errors.phone = "Invalid phone number (6-20 chars required)";
        }

        if (!subject || typeof subject !== "string" || subject.length < 2 || subject.length > 200) {
            errors.subject = "Invalid subject (2-200 chars required)";
        }

        if (!message || typeof message !== "string" || message.length < 10 || message.length > 5000) {
            errors.message = "Invalid message (10-5000 chars required)";
        }

        if (Object.keys(errors).length > 0) {
            return new Response(
                JSON.stringify({ status: "error", message: "Validation failed", data: { fields: errors } }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const resendApiKey = env.RESEND_API_KEY;
        const fromEmail = env.RESEND_FROM;
        const toEmail = env.RESEND_TO;

        if (!resendApiKey || !fromEmail || !toEmail) {
            console.error("Missing environment variables:");
            if (!resendApiKey) console.error("- RESEND_API_KEY is missing");
            if (!fromEmail) console.error("- RESEND_FROM is missing");
            if (!toEmail) console.error("- RESEND_TO is missing");

            return new Response(JSON.stringify({ status: "error", message: "Service error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const emailData = {
            from: fromEmail,
            to: toEmail,
            subject: subject,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
                <p>${message}</p>
            `,
        };

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ status: "error", message: "Failed to send email" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify({ status: "success", message: "Email sent successfully!" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    },
};