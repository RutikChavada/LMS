import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
  try {
    console.log("✅ Clerk webhook received");
    console.log("📦 Headers:", req.headers);
    console.log("📦 Raw Body:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Webhook verification
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers['svix-id'],
      "svix-timestamp": req.headers['svix-timestamp'],
      "svix-signature": req.headers['svix-signature'],
    });

    const { data, type } = req.body;
    console.log("📘 Event Type:", type);
    console.log("📘 Clerk User Data:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          imageUrl: data.image_url || "",
        };
        console.log("🚀 Saving user:", userData);
        await User.create(userData);
        res.status(200).json({ message: "User created successfully" });
        break;
      }

      case "user.deleted": {
        console.log("🗑️ Deleting user with ID:", data.id);
        await User.findByIdAndDelete(data.id);
        res.json({ message: "User deleted successfully" });
        break;
      }

      default:
        console.log("ℹ️ Unhandled event type:", type);
        res.status(200).send("No action");
        break;
    }
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
