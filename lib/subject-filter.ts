import data from "../public/data.json";

const subjectFilter = (data) => {
	for (let i = 0; i <= data.length; i++) {
		for (let j = i + 1; j <= data.length; j++) {
			if (data[i].code !== undefined && data[j].code !== undefined) {
				if (data[i].code === data[j].code) {
					console.log(data[i].code);
				}
			}
		}
	}
};

subjectFilter(data);
