import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
  
    // Not allowed in latest nextjs

    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success:false,
    //         message:"Method Not Allowed"
    //     },{status:405})
    // }
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }
        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length > 0 ? usernameErrors.join(', '):"Invalid Query Parameters"
            },{status:400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:"Username already taken"
                },
                {status:400}
            )
        }
        return Response.json(
            {
                success:true,
                message:"Username is a unique"
            },
            {status:200}
        )
    } catch (error) {
        console.log("Error checking username",error)
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },
            {status:500}
        )
    }
}