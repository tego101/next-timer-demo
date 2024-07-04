import React from "react";

import { render, screen, fireEvent, act } from "@testing-library/react";

// Import component.
import Timer from "@/components/timer-component";
import { timerStatus } from "@/components/timer-component";
import StatusLED from "@/components/timer-component";

import { start } from "repl";

describe("Timer Component", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	/**
	 * Unit tests.
	 * 1. Timer component renders.
	 * 2. Timer Starts.
	 * 3. Timer Pauses.
	 * 4. Timer Continues.
	 * 5. Timer Resets.
	 *
	 */

	// Renders.
	test("Timer Renders correctly", () => {
		render(<Timer />);
		expect(screen.getByText("00hr 00min 00sec"));
		expect(screen.getByText("START"));
		expect(screen.getByText("RESET"));
	});

	// Starts.
	test("Timer Starts", () => {
		render(<Timer />);
		const startButton = screen.getByText("START");

		act(() => {
			fireEvent.click(startButton);
			jest.advanceTimersByTime(1000);
		});

		expect(screen.getByText("00hr 00min 01sec"));
		expect(screen.getByText("PAUSE"));
	});
	// Pauses.
	test("Timer Pauses", () => {
		render(<Timer />);
		const startButton = screen.getByText("START");
		// Start timer.
		act(() => {
			fireEvent.click(startButton);
			jest.advanceTimersByTime(1000);
		});
		// Pause timer.
		const pauseButton = screen.getByText("PAUSE");
		act(() => {
			fireEvent.click(pauseButton);
		});

		// Expect pause screen.
		expect(screen.getByText("00hr 00min 01sec"));
		expect(screen.getByText("CONTINUE"));
		expect(screen.getByText("RESET"));
	});
	// Continues.
	test("Timer Continues", () => {
		render(<Timer />);
		const startButton = screen.getByText("START");
		// Start timer.
		act(() => {
			fireEvent.click(startButton);
			jest.advanceTimersByTime(1000);
		});
		// Pause timer.
		const pauseButton = screen.getByText("PAUSE");

		act(() => {
			fireEvent.click(pauseButton);
		});

		// Expect pause screen.
		expect(screen.getByText("00hr 00min 01sec"));
		expect(screen.getByText("CONTINUE"));
		expect(screen.getByText("RESET"));

		// Continue Timer.
		const continueButton = screen.getByText("CONTINUE");

		act(() => {
			fireEvent.click(continueButton);
			jest.advanceTimersByTime(1000);
		});

		expect(screen.getByText("00hr 00min 02sec"));
		expect(pauseButton);
	});
	// Resets.
	test("Timer Resets", () => {
		render(<Timer />);
		const startButton = screen.getByText("START");
		// Start timer.
		act(() => {
			fireEvent.click(startButton);
			jest.advanceTimersByTime(1000);
		});
		// Pause timer.
		const pauseButton = screen.getByText("PAUSE");
		act(() => {
			fireEvent.click(pauseButton);
		});

		// Expect pause screen.
		expect(screen.getByText("00hr 00min 01sec"));
		expect(screen.getByText("CONTINUE"));
		expect(screen.getByText("RESET"));

		const resetButton = screen.getByText("RESET");

		act(() => {
			fireEvent.click(resetButton);
			jest.clearAllTimers();
		});

		expect(screen.getByText("00hr 00min 00sec"));
		expect(startButton);
		expect(resetButton);
	});
});
