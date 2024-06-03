//@ts-nocheck

import fs from "node:fs";
import data from "../public/data.json";

const subjectFilter = (data) => {
	const clean = data.filter(
		(data, index, self) =>
			index === self.findIndex((t) => t.code === data.code),
	);

	const filteredData = clean.map((item) => ({
		code: item.code,
		title: item.title,
	}));

	fs.writeFileSync("public/data.json", JSON.stringify(filteredData, null, 2));
};

subjectFilter(data);
