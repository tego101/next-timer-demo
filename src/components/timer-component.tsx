"use client";

import React, { useState, useEffect, useRef } from "react";

const formatTime = (timeInt: Number): string => {
	return timeInt.toString().padStart(2, "0");
};

// Types.
interface ClockProps {
	status: string;
	hours: number;
	minutes: number;
	seconds: number;
}

export enum timerStatus {
	NOT_COUNTING,
	COUNTING,
	PAUSED,
}

/**
 * StatusLED
 * ============
 * Displays the status of the timer based on the input.
 */
export const StatusLED = ({
	currentStatus,
}: {
	currentStatus: timerStatus;
}): JSX.Element => {
	// Styles.
	const redLEDStyle = {
		backgroundColor: "red",
		height: "8px",
		width: "8px",
		borderRadius: "5px",
		padding: "10px 5px 10px 5px",
		margin: "5px 10px 0px 10px",
	};

	const greenLEDStyle = {
		backgroundColor: "green",
		height: "8px",
		width: "8px",
		borderRadius: "5px",
		padding: "10px 5px 10px 5px",
		margin: "5px 10px 0px 10px",
	};

	const grayLEDStyle = {
		backgroundColor: "gray",
		height: "8px",
		width: "8px",
		borderRadius: "5px",
		padding: "10px 5px 10px 5px",
		margin: "5px 10px 0px 10px",
	};

	return (
		<div>
			{
				{
					[timerStatus.COUNTING]: <div style={greenLEDStyle} role='status' />,
					[timerStatus.PAUSED]: <div style={redLEDStyle} role='status' />,
					[timerStatus.NOT_COUNTING]: (
						<div style={grayLEDStyle} role='status' />
					),
				}[currentStatus]
			}
		</div>
	);
};

export default function Timer() {
	const intervalRef = useRef<NodeJS.Timeout | Timer | null>(null);
	const [status, setTimerStatus] = useState<timerStatus>(
		timerStatus.NOT_COUNTING
	);

	// Booleans.
	const [isCounting, setIsCounting] = useState<boolean>(false);
	const [setTimerTime, setTimer] = useState<boolean>(false);

	// Timer Values.
	const [clockHour, setClockHour] = useState<ClockProps["hours"]>(0);
	const [clockMinutes, setClockMinutes] = useState<ClockProps["minutes"]>(0);
	const [clockSeconds, setClockSeconds] = useState<ClockProps["seconds"]>(0);

	const countUp = () => {
		setClockSeconds((prev) => {
			const newSeconds = Math.floor(prev + 1);
			if (newSeconds === 60) {
				setClockMinutes((prevMinutes) => {
					const newMinutes = Math.floor(prevMinutes + 1);
					if (newMinutes === 60) {
						setClockHour((prevHour) => Math.floor((prevHour + 1) % 24));
						return 0;
					}
					return newMinutes;
				});
				return 0;
			}
			return newSeconds;
		});
	};

	// Count logic.
	const doCount = () => {
		if (status == timerStatus.COUNTING) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				setTimerStatus(timerStatus.PAUSED);
			}
			return;
		}

		if (status === timerStatus.PAUSED || status === timerStatus.NOT_COUNTING) {
			setTimerStatus(timerStatus.COUNTING);
			setIsCounting(true);
			intervalRef.current = setInterval(countUp, 1000);
		}
	};

	const handleStartStop = (): void => {
		doCount();
		return;
	};

	const handleReset = (): void => {
		setTimerStatus(timerStatus.NOT_COUNTING);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setClockHour(0);
		setClockMinutes(0);
		setClockSeconds(0);
	};

	// Styles.
	const buttonStyle = {
		margin: "0px 10px 0px 5px",
		border: "1px solid #000000",
		padding: "4px 4px 4px 4px",
		borderRadius: "5px",
		backgroundColor: "#FFFFFF",
		fontWeight: "bold",
	};

	const inputStyle = {
		margin: "0px 10px 0px 5px",
		border: "1px solid #000000",
		padding: "4px 4px 4px 4px",
		borderRadius: "5px",
		backgroundColor: "#FFFFFF",
	};

	const clockStyle = {
		padding: "10px 0px 10px",
		fontSize: "48px",
		fontWeight: "bold",
	};

	const setClockValuesStyle = {
		padding: "5px 5px 20px 5px",
		borderBottom: "1px solid #CCCCCC",
	};

	const clockControlStyle = {
		padding: "10px 0px 5px 0px",
	};

	const clockContainerStyle = {
		padding: "10px 10px 10px 10px",
		border: "4px solid #575757",
		borderRadius: "24px",
		backgroundColor: "#F7F7F7",
		boxShadow: "10px 10px 10px 10px #CCCCCC",
	};

	return (
		<div style={clockContainerStyle}>
			<StatusLED currentStatus={status} />
			<div style={clockStyle}>
				{`
          ${formatTime(clockHour)}hr ${formatTime(
					clockMinutes
				)}min ${formatTime(clockSeconds)}sec
        `}
			</div>
			{setTimerTime ? (
				<div style={setClockValuesStyle}>
					<input
						type='number'
						onChange={(e) => setClockHour(Number(e.target.value))}
						style={inputStyle}
					/>
					hr
					<input
						type='number'
						onChange={(e) => setClockMinutes(Number(e.target.value))}
						style={inputStyle}
					/>
					mins
					<input
						type='number'
						onChange={(e) => setClockSeconds(Number(e.target.value))}
						style={inputStyle}
					/>
					secs
				</div>
			) : null}
			<div style={clockControlStyle}>
				<button onClick={() => handleStartStop()} style={buttonStyle}>
					{
						{
							[timerStatus.COUNTING]: "PAUSE",
							[timerStatus.PAUSED]: "CONTINUE",
							[timerStatus.NOT_COUNTING]: "START",
						}[status]
					}
				</button>
				{status != timerStatus.COUNTING ? (
					<button onClick={() => handleReset()} style={buttonStyle}>
						RESET
					</button>
				) : null}
			</div>
		</div>
	);
}
