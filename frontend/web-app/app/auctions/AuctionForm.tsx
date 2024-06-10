"use client";

import {FieldValues, useForm} from "react-hook-form";
import {Button, TextInput} from "flowbite-react";
import Input from "@/app/components/Input";

export default function AuctionForm() {
    const {
        control,
        register,
        handleSubmit,
        setFocus,
        formState: {isSubmitting, isValid, isDirty, errors}
    } = useForm();
    
    function onSubmit(data: FieldValues) {
        console.log(data);
    }

    return (
        <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Make" name="make" control={control} rules={{required: "Make is required"}} />
            <Input label="Model" name="model" control={control} rules={{required: "Model is required"}} />
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