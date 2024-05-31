import Navbar from "@/components/navbar";
import About from "@/components/sections/about";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import Pricing from "@/components/sections/pricing";
import LenisSmoothScroll from "@/contexts/lenis-provider";

export default function HomePage() {
	return (
		<LenisSmoothScroll>
			<Navbar />
			<Hero />
			<About />
			<Pricing />
			<Footer />
		</LenisSmoothScroll>
	);
}
