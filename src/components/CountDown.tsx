import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Countdown = ({epochTime}) => {
  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    const difference = +new Date(epochTime * 1000) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
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
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });
  return (
    <>
      <h1 className="text-4xl font-bold font-header text-darkBlue">Time until unlock: </h1>
      <StyledCountDown>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </StyledCountDown>
    </>
  );
};

const StyledCountDown = styled.div`
  font-size: 30px;
  justify-content: center;
  font-family: Orbitron;
  color: #f4c521;
`;

export default Countdown;