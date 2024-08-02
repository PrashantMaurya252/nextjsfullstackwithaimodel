import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {Message} from "@/models/User"

export async function POST(request:Request){
    await dbConnect()

    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                  success: false,
                  messages: "User Not found",
                },
                { status: 404 }
              );
        }

        // is user accepting messages

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  messages: "User is not accepting the messages",
                },
                { status: 403 }
              );
        }

        const newMessage = {content,createdAt:new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
              success: true,
              messages: "message sent successfully",
            },
            { status: 401 }
          );
    } catch (error) {
        console.log("An unexpected error occured during adding messages",error)
    return Response.json(
      {
        success:false,
        messages: "Unexpected Error in send Messages",
      },
      { status: 500 }
    );
    }
}