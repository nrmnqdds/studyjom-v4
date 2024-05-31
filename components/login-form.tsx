"use client";

import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/cn";
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
	username: z.string().min(6).max(50),
	password: z.string().min(3).max(50),
});

const LoginForm = ({ className }: { className?: string }) => {
	const [open, setOpen] = useState(false);
	const { setSession } = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const loginMutation = useMutation({
		mutationKey: ["login"],
		mutationFn: async (payload: { username: string; password: string }) => {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			setSession(data.data);
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		toast.promise(
			loginMutation.mutateAsync({
				username: values.username,
				password: values.password,
			}),
			{
				loading: "Logging in...",
				success: "Logged in successfully",
				error: "Failed to login",
			},
		);
	};

	return (
		<>
			<Button className={cn("", className)} onClick={() => setOpen(true)}>
				Log In
			</Button>
			<Transition show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setOpen}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</TransitionChild>

					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<TransitionChild
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<DialogPanel className="relative transform overflow-hidden rounded-lg bg-purple-300 border-2 border-solid border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-4 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
									<DialogTitle className="mb-5">
										<h1 className="text-black font-bold text-center text-2xl">
											Log in with iMa&apos;luum
										</h1>
									</DialogTitle>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-5"
									>
										<Input
											type="text"
											className="w-full text-black"
											placeholder="Matric Number"
											{...form.register("username")}
										/>
										<Input
											type="password"
											className="w-full text-black"
											placeholder="Password"
											{...form.register("password")}
										/>
										<Button
											type="submit"
											onClick={form.handleSubmit(onSubmit)}
											className="w-full bg-green-300 hover:bg-green-400 active:bg-green-500 disabled:bg-green-500"
											disabled={
												loginMutation.isPending || loginMutation.isSuccess
											}
										>
											{loginMutation.isPending || loginMutation.isSuccess
												? "Logging in..."
												: "Log in"}
										</Button>
									</form>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default LoginForm;
