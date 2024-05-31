import { cn } from "@/lib/cn";
import data from "@/public/data.json";
import {
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Combobox as HCombobox,
	Label,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SubjectsCombobox({
	title,
	onChange,
}: { title: string; onChange: (subject: string) => void }) {
	const [query, setQuery] = useState("");
	const [selectedPerson, setSelectedPerson] = useState<{
		code: string;
		title: string;
	}>();
	const parentRef = useRef(null);

	const subjectList: { code: string; title: string }[] = useMemo(() => {
		return data.map((person) => ({
			code: person.code,
			title: person.title,
		}));
	}, []);

	const filteredData =
		query === ""
			? subjectList
			: subjectList.filter(
					(person) =>
						person.code.toLowerCase().includes(query.toLowerCase()) ||
						person.title.toLowerCase().includes(query.toLowerCase()),
				);

	// The virtualizer
	const rowVirtualizer = useVirtualizer({
		count: filteredData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 35,
		overscan: 5,
	});

	useEffect(() => {
		if (selectedPerson) {
			onChange(selectedPerson.title);
		}
	}, [selectedPerson, onChange]);

	return (
		//@ts-ignore
		<HCombobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
			<Label className="block text-sm font-medium leading-6 text-gray-900">
				{title}
			</Label>
			<div className="relative">
				<ComboboxInput
					className="rounded-md border-2 border-black p-[10px] font-bold shadow-default outline-none transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none text-black w-full"
					onChange={(event) => setQuery(event.target.value)}
					// @ts-ignore
					displayValue={(person) => `(${person?.code}) ${person?.title}`}
				/>

				{filteredData.length > 0 && (
					<ComboboxOptions
						ref={parentRef}
						className="absolute caret-transparent z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => (
							<ComboboxOption
								key={virtualRow.index}
								value={filteredData[virtualRow.index]}
								className={({ focus }) =>
									cn(
										"relative cursor-default select-none py-2 pl-8 pr-4",
										focus ? "bg-indigo-600 text-white" : "text-gray-900",
									)
								}
							>
								{({ focus, selected }) => (
									<>
										<span
											className={cn(
												"block truncate",
												selected && "font-semibold",
											)}
										>
											{`(${filteredData[virtualRow.index]?.code}) ${
												filteredData[virtualRow.index]?.title
											}`}
										</span>

										{selected && (
											<span
												className={cn(
													"absolute inset-y-0 left-0 flex items-center pl-1.5",
													focus ? "text-white" : "text-indigo-600",
												)}
											>
												<CheckIcon className="h-5 w-5" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</ComboboxOption>
						))}
					</ComboboxOptions>
				)}
			</div>
		</HCombobox>
	);
}
