"use client";

import Card from "../hero/card";
import CustomLottiePlayer from "../hero/custom-lottie";
import InfiniteText from "./infinite-text";

const About = () => {
	return (
		<section
			id="about"
			className="w-full h-fit py-24 relative bg-[rgb(254,227,198)] border-t-2 border-solid border-black overflow-hidden"
		>
			<InfiniteText input="What is StudyJom? -" />
			<div className="w-full h-full flex flex-row mt-[50px] md:mt-[250px]">
				<div className="flex-1 flex justify-center pt-24">
					<Card
						title="Your one-stop notes sharing platform!"
						description="StudyJom is an initiative to help students share their notes with
          their peers. We believe that sharing is caring and we want to help
          students ace their exams!"
					/>
				</div>
				<div className="flex-1 flex justify-center">
					<div>
						<CustomLottiePlayer
							animationData={require("../../../public/lottie/Animation - 1704364424859.lottie")}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
