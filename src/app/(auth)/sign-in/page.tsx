'use client'
import  { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ApiResponse } from '@/types/ApiResponse'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'




const SignIn = () => {
  
  
  
  const [isSubmitting,setIsSubmitting] = useState(false)
  
  const {toast} = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      
      identifier:'',
      password:''
    }
  })

 

  const onSubmit = async(data:z.infer<typeof signInSchema>)=>{
    const result =  await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    if(result?.error){
      toast({
        title:"Login Failed",
        description:"Incorrect username or password",
        variant:"destructive"
      })
    }
    if(result?.url){
      router.replace('/dashboard')
    }
    console.log(result,"signin result")
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join True Feedback
        </h1>
        <p className="mb-4">Sign up to start your anonymous adventure</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} name="email" />
                <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} name="password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' disabled={isSubmitting}>
            Signin
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Create a new account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default SignIn

