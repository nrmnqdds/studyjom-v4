"use client";

import { useSession } from "@/hooks/use-session";
import { Button } from "./default/button";
import LoginForm from "./login-form";
import SuperLink from "./super-link";
import UserDropdown from "./user-dropdown";

const navigations = [
	{
		name: "Home",
		href: "#hero",
	},
	{
		name: "About",
		href: "#about",
	},
	{
		name: "Pricing",
		href: "#pricing",
	},
];

const Navbar = () => {
	const { session } = useSession();

	return (
		<nav className="fixed z-10 top-10 w-full flex items-center justify-center">
			<div className="absolute top-0 right-10 flex flex-row gap-5 items-center justify-center">
				<SuperLink href="/browse">
					<Button>Browse Notes</Button>
				</SuperLink>

				{session ? <UserDropdown /> : <LoginForm />}
			</div>
			<div className="bg-purple-300 border-2 border-solid border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-md">
				<ul className="flex items-center justify-center px-1">
					{navigations.map((navigation) => (
						<li className="group cursor-pointer p-2" key={navigation.name}>
							<h1
								className="text-black group-hover:text-purple-900"
								onClick={(e) => {
									e.preventDefault();
									const element = document.querySelector(navigation.href);
									if (element) {
										element.scrollIntoView({ behavior: "smooth" });
									}
								}}
							>
								{navigation.name}
							</h1>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
