import UnverifiedNotes from "@/components/unverified-notes-list";

const BrowsePage = () => {
	return (
		<div className="w-full">
			<p className="text-black font-bold">Unverified Notes</p>
			<UnverifiedNotes />
		</div>
	);
};

export default BrowsePage;
