import { redisClient } from "./redis";

export const useSession = () => {
	const get = async (key: string) => {
		return await redisClient.get(key);
	};

	const set = async (key: string, value: string) => {
		return await redisClient.set(key, value);
	};

	const del = async (key: string) => {
		return await redisClient.del(key);
	};

	return {
		get,
		set,
		del,
	};
};
