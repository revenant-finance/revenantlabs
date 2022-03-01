import React, { useEffect, useState } from "react";

const Countdown = ({epochTime}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(epochTime * 1000) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {timeLeft[interval] !== 1 ? interval : interval.slice(0, -1)}{" "}
      </span>
    );
  });
  return (
    <>
      <h1 className="font-bold font-header">Time until Next Distribution: </h1>
        {timerComponents.length ? timerComponents : <span>Distribution Unlocked: Claim your Rewards</span>}
    </>
  );
};


export default Countdown;