import UnverifiedNotes from "@/components/unverified-notes-list";

const BrowsePage = () => {
	return (
		<div className="w-full">
			<p className="text-black text-2xl sm:text-4xl font-bold">
				Unverified Notes
			</p>
			<UnverifiedNotes />
		</div>
	);
};

export default BrowsePage;
