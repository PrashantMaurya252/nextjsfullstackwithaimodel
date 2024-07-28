import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
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