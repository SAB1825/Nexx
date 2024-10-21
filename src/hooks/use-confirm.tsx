"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ResponsiveModal } from "@/components/dashboard/responsive-modal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
export const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps["variant"] = "default",
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void,
    } | null>(null)

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({resolve})
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const ConfirmDialog = () => (
        <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full border border-zinc-900 max-w-md mx-auto rounded-lg shadow-lg bg-black text-white">
                <CardContent className="flex flex-col gap-y-4">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-x-5">
                        <Button variant={variant} onClick={handleConfirm}>Confirm</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )

    return [ConfirmDialog, confirm] 
}