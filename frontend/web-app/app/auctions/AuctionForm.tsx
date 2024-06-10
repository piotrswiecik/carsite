"use client";

import {FieldValues, useForm} from "react-hook-form";
import {Button, TextInput} from "flowbite-react";
import Input from "@/app/components/Input";
import {useEffect} from "react";
import DateInput from "@/app/components/DateInput";
import {createAuction} from "@/app/actions/auctionActions";
import {useRouter} from "next/navigation";

export default function AuctionForm() {
    const {
        control,
        register,
        handleSubmit,
        setFocus,
        formState: {isSubmitting, isValid, isDirty, errors}
    } = useForm({mode: "onTouched"});
    
    const router = useRouter();

    useEffect(() => {
        setFocus("make");
    }, [setFocus])

    async function onSubmit(data: FieldValues) {
        try {
            const res = await createAuction(data);
            if (res.error) {
                throw new Error(res.error);
            }
            router.push(`/auctions/details/${res.id}`); // TODO: type safety
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Make" name="make" control={control} rules={{required: "Make is required"}}/>
            <Input label="Model" name="model" control={control} rules={{required: "Model is required"}}/>
            <Input label="Color" name="color" control={control} rules={{required: "Color is required"}}/>
            <div className="grid grid-cols-2 gap-3">
                <Input label="Year" name="year" type="number" control={control} rules={{required: "Year is required"}}/>
                <Input label="Mileage" name="mileage" type="number" control={control}
                       rules={{required: "Mileage is required"}}/>
            </div>
            <Input label="Image URL" name="imageUrl" control={control}
                   rules={{required: "Image URL is required"}}/>
            <div className="grid grid-cols-2 gap-3">
                <Input label="Reserve price (enter 0 if none)" name="reservePrice" type="number" control={control}
                       rules={{required: "Reserve price is required"}}/>
                <DateInput label="Auction end date/time" name="auctionEnd" control={control}
                           rules={{required: "Date is required"}} dateFormat="dd MMMM yyyy h:mm a" showTimeSelect/>
            </div>
            <div className="flex justify-between">
                <Button outline color="gray">Cancel</Button>
                <Button
                    isProcessing={isSubmitting}
                    outline
                    color="success"
                    disabled={!isValid}
                    type="submit"
                >Submit</Button>
            </div>
        </form>
    );
}