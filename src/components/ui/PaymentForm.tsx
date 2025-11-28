"use client";

import { PaymentFormInputs, paymentFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

const PaymentForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PaymentFormInputs>({
        resolver: zodResolver(paymentFormSchema),
    });

    const handlePaymentForm: SubmitHandler<PaymentFormInputs> = (data) => {
        console.log(data);
        // Add logic here (e.g., API call, router.push)
    };

    return (
        <form onSubmit={handleSubmit(handlePaymentForm)} className="space-y-6">
            {/* Field 1: Name on Card */}
            <div>
                <label
                    htmlFor="cardHolder"
                    className="block text-sm font-medium text-neutral-700"
                >
                    Name on Card
                </label>
                <input
                    type="text"
                    id="cardHolder"
                    placeholder="e.g. John Doe"
                    {...register("cardHolder")}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm"
                />
                {errors.cardHolder && (
                    <p className="mt-1 text-sm text-neutral-600">
                        {errors.cardHolder.message}
                    </p>
                )}
            </div>

            {/* Field 2: Card Number */}
            <div>
                <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-neutral-700"
                >
                    Card Number
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    {...register("cardNumber")}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm"
                />
                {errors.cardNumber && (
                    <p className="mt-1 text-sm text-neutral-600">
                        {errors.cardNumber.message}
                    </p>
                )}
            </div>

            {/* Row for Expiration and CVV */}
            <div className="flex gap-4">
                {/* Field 3: Expiration Date */}
                <div className="w-1/2">
                    <label
                        htmlFor="expirationDate"
                        className="block text-sm font-medium text-neutral-700"
                    >
                        Expiration (MM/YY)
                    </label>
                    <input
                        type="text"
                        id="expirationDate"
                        placeholder="MM/YY"
                        {...register("expirationDate")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm"
                    />
                    {errors.expirationDate && (
                        <p className="mt-1 text-sm text-neutral-600">
                            {errors.expirationDate.message}
                        </p>
                    )}
                </div>

                {/* Field 4: CVV */}
                <div className="w-1/2">
                    <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-neutral-700"
                    >
                        CVV
                    </label>
                    <input
                        type="text"
                        id="cvv"
                        placeholder="123"
                        {...register("cvv")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-neutral-900 sm:text-sm"
                    />
                    {errors.cvv && (
                        <p className="mt-1 text-sm text-neutral-600">{errors.cvv.message}</p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
                Pay Now <ArrowRight className="ml-2 h-4 w-4" />
            </button>
        </form>
    );
};

export default PaymentForm;