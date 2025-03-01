
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Form schema with validation
const formSchema = z.object({
  phoneNumber: z.string().min(8, {
    message: "Phone number must be at least 8 digits",
  }),
  otp: z
    .string()
    .min(6, {
      message: "OTP code must be 6 digits.",
    })
    .max(6),
});

type FormValues = z.infer<typeof formSchema>;

const OtpVerification = () => {
  const [countryCode, setCountryCode] = useState("+65");
  const [resendTimer, setResendTimer] = useState(114);
  const [canResend, setCanResend] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
    mode: "onChange",
  });

  // Start timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast.success("OTP verified successfully!");
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (canResend) {
      // Reset the timer
      setResendTimer(114);
      setCanResend(false);
      
      // Show a toast notification
      toast.success("OTP resent successfully");
      
      // In a real app, you would call your API to resend the OTP here
      console.log("Resending OTP...");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <div className="flex">
                  <div className="flex items-center border rounded-l-md px-3 bg-white border-r-0">
                    <span className="text-sm font-medium text-teal-500">{countryCode}</span>
                    <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="9000 0008"
                      className="rounded-l-none focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="text-sm text-gray-700 mb-2">
              Enter the code sent via SMS to the number above
            </p>
            <FormLabel>One-time Password</FormLabel>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      render={({ slots }) => (
                        <div className="flex gap-2">
                          {slots.map((slot, index) => (
                            <InputOTPGroup key={index} className={index === 0 ? "border-teal-500" : ""}>
                              <InputOTPSlot
                                {...slot}
                                className="w-12 h-12 text-xl"
                              />
                            </InputOTPGroup>
                          ))}
                        </div>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={handleResendOtp}
            className={`w-full ${
              canResend ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400"
            }`}
            disabled={!canResend}
          >
            RESEND OTP
          </Button>
          
          {!canResend && (
            <p className="text-center text-sm text-gray-500">
              Resend available in {resendTimer} seconds
            </p>
          )}

          <Button type="submit" className="hidden">
            Verify
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;
