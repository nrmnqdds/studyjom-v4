"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/default/avatar";
import SuperLink from "@/components/super-link";
import { useSession } from "@/hooks/use-session";
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import toast from "react-hot-toast";

const UserDropdown = () => {
	const { session, refetch } = useSession();
	const router = useRouter();

	const logoutMutation = useMutation({
		mutationKey: ["logout"],
		mutationFn: async () => {
			await fetch("/api/auth/login", {
				method: "DELETE",
			});

			await refetch();

			router.push("/");
		},
	});

	const onLogout = async () => {
		toast.promise(logoutMutation.mutateAsync(), {
			loading: "Logging out...",
			success: "Logged out successfully",
			error: "Failed to logout",
		});
	};

	return (
		<Menu as="div" className="relative">
			<MenuButton className="-m-1.5 flex items-center p-1.5">
				<span className="sr-only">Open user menu</span>
				<Avatar>
					<AvatarImage src={session?.image_url as string} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<span className="hidden lg:flex lg:items-center">
					<span
						className="ml-4 text-sm font-semibold leading-6 text-gray-900"
						aria-hidden="true"
					>
						{session?.matric_no}
					</span>
				</span>
			</MenuButton>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
					<MenuItem>
						<SuperLink
							href="/profile"
							className="block text-sm text-black px-3 py-1 leading-6 hover:text-indigo-800 w-full"
						>
							Profile
						</SuperLink>
					</MenuItem>
					<MenuItem>
						<h1
							onClick={onLogout}
							className="block cursor-pointer text-sm text-black px-3 py-1 leading-6 hover:text-red-800 w-full"
						>
							Log out
						</h1>
					</MenuItem>
				</MenuItems>
			</Transition>
		</Menu>
	);
};

export default UserDropdown;
