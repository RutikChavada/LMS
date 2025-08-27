import { Webhook } from "svix";
import User from "../models/User.js";
import { request, response } from "express";
import Stripe from "stripe";
import { EndpointApi, EndpointSecretOut } from "svix/dist/openapi/index.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

export const clerkwebhooks = async (req, res) => {
  try {
    console.log("Clerk webhook received");
    console.log("Headers:", req.headers);
    console.log("Raw Body:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Webhook verification
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers['svix-id'],
      "svix-timestamp": req.headers['svix-timestamp'],
      "svix-signature": req.headers['svix-signature'],
    });

    const { data, type } = req.body;
    console.log("Event Type:", type);
    console.log("Clerk User Data:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          imageUrl: data.image_url || "",
        };
        console.log("Saving user:", userData);
        await User.create(userData);
        res.status(200).json({ message: "User created successfully" });
        break;
      }

      case "user.deleted": {
        console.log("Deleting user with ID:", data.id);
        await User.findByIdAndDelete(data.id);
        res.json({ message: "User deleted successfully" });
        break;
      }

      default:
        console.log("Unhandled event type:", type);
        res.status(200).send("No action");
        break;
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (request,response) => {
  console.log("Stripe webhook endpoint hit");
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
    console.log(event.type)
  } catch (error) {
    response.status(400).send(`webhook Error: ${error.message}`)
  }

  switch(event.type){
    case 'payment_intent.succeeded':{
      // console.log("this portion is working !")
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata
      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())
      courseData.enrolledStudents.push(userData)
      await courseData.save() 
      userData.enrolledCourses.push(courseData._id)
      await userData.save()
      purchaseData.status = 'completed'
      await purchaseData.save()
      break;
    }
    case 'payment_intent.payment_failed':{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      })
      const {purchaseId} = session.data[0].metadata
      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'failed'
      await purchaseData.save()
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  response.json({received: true})
}
