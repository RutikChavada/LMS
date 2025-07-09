import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers['svix-id'],
        })
        const {data,type} = req.body;
        switch(type){
            case "user.created": {
                const userData = {
                    _id : data.id,
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.create(userData);
                res.status(200).json({message: "User created successfully"});
                break;
            }
            case "user.updated": {
                const userData = {
                    email : data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id,userData)
                res.json()
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({})
                break;
            }
            default:
                break;
        }
    }catch(err){
        res.json({success: false, message: err.message});
    }
}