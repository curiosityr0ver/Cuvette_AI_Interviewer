import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import questions from "../data/questions";
import styles from "./QuizPage.module.css";

const QuizPage = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedBlobs, setRecordedBlobs] = useState([]);
	const [quizCompleted, setQuizCompleted] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeElapsed((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleStartRecording = () => {
		setIsRecording(true);
	};

	const handleStopRecording = (recordedBlob) => {
		setIsRecording(false);
		const updatedBlobs = [...recordedBlobs];
		updatedBlobs[currentQuestion] = recordedBlob.blob;
		setRecordedBlobs(updatedBlobs);
	};

	const handleNext = () => {
		if (currentQuestion === questions.length - 1) {
			setQuizCompleted(true);
			setTimeElapsed(0); // Stop the timer
		} else {
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handleSkip = () => {
		if (currentQuestion === questions.length - 1) {
			setQuizCompleted(true);
			setTimeElapsed(0); // Stop the timer
		} else {
			setRecordedBlobs((prevBlobs) => {
				const updatedBlobs = [...prevBlobs];
				updatedBlobs[currentQuestion] = "skipped";
				return updatedBlobs;
			});
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handleReRecord = () => {
		setRecordedBlobs((prevBlobs) => {
			const updatedBlobs = [...prevBlobs];
			updatedBlobs[currentQuestion] = null;
			return updatedBlobs;
		});
	};

	useEffect(() => {
		console.log(recordedBlobs);
	}, [recordedBlobs]);

	return (
		<div className={styles.container}>
			<div className={styles.timer}>
				<span>Time Elapsed: {timeElapsed} seconds</span>
			</div>
			{!quizCompleted && (
				<div>
					<div className={styles.questionTimeline}>
						{questions.map((q, index) => (
							<span
								key={q.id}
								style={{
									margin: "0 5px",
									padding: "5px",
									border: "1px solid",
									backgroundColor:
										index === currentQuestion
											? "yellow"
											: recordedBlobs[index] === "skipped"
											? "yellow"
											: recordedBlobs[index]
											? "green"
											: "white",
								}}
							>
								{index + 1}
							</span>
						))}
					</div>
					<div className={styles.questionContainer}>
						<h2>{questions[currentQuestion].text}</h2>
						{!recordedBlobs[currentQuestion] ||
						recordedBlobs[currentQuestion] === "skipped" ? (
							<div>
								<ReactMic
									record={isRecording}
									className="sound-wave"
									onStop={handleStopRecording}
									mimeType="audio/webm"
								/>
								<div>
									{isRecording ? (
										<button onClick={() => setIsRecording(false)}>
											Stop Recording
										</button>
									) : (
										<button onClick={handleStartRecording}>
											Start Recording
										</button>
									)}
								</div>
							</div>
						) : (
							<div>
								<audio controls>
									<source
										src={URL.createObjectURL(recordedBlobs[currentQuestion])}
										type="audio/webm"
									/>
									Your browser does not support the audio element.
								</audio>
								<button onClick={handleReRecord}>Re-record</button>
							</div>
						)}
						<button onClick={handleNext}>Next</button>
						<button onClick={handleSkip}>Skip</button>
					</div>
				</div>
			)}
			{quizCompleted && (
				<div className={styles.completedContainer}>
					<h2>Quiz Completed!</h2>
					<button onClick={() => window.location.reload()}>Restart Quiz</button>
					<div>
						{recordedBlobs.map((blob, index) => (
							<div key={index}>
								{blob && blob !== "skipped" && (
									<audio controls>
										<source src={URL.createObjectURL(blob)} type="audio/webm" />
										Your browser does not support the audio element.
									</audio>
								)}
								{blob === "skipped" && <p>Question {index + 1} was skipped</p>}
								{!blob && <p>Question {index + 1} was not attempted</p>}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default QuizPage;
