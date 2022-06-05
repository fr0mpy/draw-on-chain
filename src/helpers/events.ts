let throttlePause: Boolean;

const throttle = (callback: Function, time: number) => {
	if (throttlePause) return;
	throttlePause = true;

	setTimeout(() => {
		callback();

		throttlePause = false;
	}, time);
};

export default throttle;