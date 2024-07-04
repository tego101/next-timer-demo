import Timer from "@/components/timer-component";

export default function Home() {
	return (
		<main className='flex min-h-screen dark:bg-white dark:text-black flex-col items-center justify-between p-24'>
			<Timer />
		</main>
	);
}
