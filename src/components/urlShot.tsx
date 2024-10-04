"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Loader from "./loader";
const UrlShot = () => {
  const [isSowUrl, setShowUrl] = useState<boolean>(false);
  const [longUrl, setLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [errors , setErrors] =useState<string>('')
  const [loader , setLoader] =useState(false)
  const [copy , setCopy] =useState(false)
  //    handel submit button
  const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";
  const BITLY_ACCESS_TOKEN = process.env.NEXT_PUBLIC_BITLY_ACCESS_TOKEN;

  async function handelSubmitButton(e: React.FormEvent) {
    e.preventDefault();
    setLongUrl("");
    setLoader(true)
    try {

      const response = await axios.post(
        BITLY_API_URL,
        {
          long_url: longUrl,
        },
        {
          headers:{
            Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.link);

      setShortUrl(response.data.link)
    } catch (error) {
      console.error(error);
      
    }finally{
      setLoader(false)
        setShowUrl(true)  
        setCopy(false) 
    }
  }

  // clear url
  const handelClearInterval=()=>{
    setShowUrl(false),
    setLongUrl("")
  }

//   handel copy to  clipboard

  const copyToClipboard=(text:string)=>{navigator.clipboard.writeText(text)
    setCopy(!copy)
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="max-w-[450px] w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            URL Shortener
          </CardTitle>
          <CardDescription className="text-base font-medium">
            {" "}
            Paste your long URL and get a short, shareable link.{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handelSubmitButton}>
            <div className="grid w-full items-center gap-4 -mt-2">
              <div className="flex   gap-2 ">
                <Input
                required
                  id="name"
                  placeholder="Past your url here."
                  value={longUrl}
                  onChange={(e)=>setLongUrl(e.target.value)}
                  className="rounded-xl"
                />
                <Button type="submit" className="rounded-xl">{loader ? <Loader/> : "Short Url"}</Button>
              </div>
            </div>
          </form>
        </CardContent>
        {isSowUrl && (
          <CardFooter className="flex  gap-1">
            <Input id="name" className="rounded-xl" value={shortUrl} readOnly />
            {copy  ? <Button className="rounded-xl" onClick={handelClearInterval}>Clear</Button>: <Button className="rounded-xl" onClick={()=>copyToClipboard(shortUrl)}>Copy</Button> }
           
           

          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UrlShot;
