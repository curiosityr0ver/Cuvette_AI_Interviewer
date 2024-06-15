import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import quizQuestions from "../data/questions";
import styles from "./QuizPage.module.css";

const QuizPage = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedBlobs, setRecordedBlobs] = useState([]);
	const [quizCompleted, setQuizCompleted] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			if (!quizCompleted) setTimeElapsed((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [quizCompleted]);

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
		if (currentQuestion === quizQuestions.length - 1) {
			setQuizCompleted(true);
		} else {
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const handleSkip = () => {
		if (currentQuestion === quizQuestions.length - 1) {
			setQuizCompleted(true);
		} else {
			setRecordedBlobs((prevBlobs) => {
				const updatedBlobs = [...prevBlobs];
				updatedBlobs[currentQuestion] = null;
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

	return (
		<div className={styles.container}>
			<div>
				<span>Time Elapsed: {timeElapsed} seconds</span>
			</div>
			{!quizCompleted && (
				<div>
					<div className={styles.questionMarkers}>
						{quizQuestions.map((q, index) => (
							<span
								key={q.id}
								className={
									currentQuestion === index
										? styles.currentQuestion
										: recordedBlobs[index]
										? styles.answeredQuestion
										: styles.unansweredQuestion
								}
								onClick={() => setCurrentQuestion(index)}
							>
								{index + 1}
							</span>
						))}
					</div>
					<div className={styles.question}>
						<h2>{quizQuestions[currentQuestion].text}</h2>
						{!recordedBlobs[currentQuestion] ? (
							<div>
								<ReactMic
									record={isRecording}
									className={styles.soundWave}
									onStop={handleStopRecording}
									mimeType="audio/webm"
								/>
								<div className={styles.buttons}>
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
								<div className={styles.buttons}>
									<button onClick={handleReRecord}>Re-record</button>
								</div>
							</div>
						)}
						<div className={styles.buttons}>
							<button onClick={handleNext} disabled={isRecording}>
								Next
							</button>
							<button onClick={handleSkip} disabled={isRecording}>
								Skip
							</button>
						</div>
					</div>
				</div>
			)}
			{quizCompleted && (
				<div className={styles.quizCompleted}>
					<h2>Quiz Completed!</h2>
					<button onClick={() => window.location.reload()}>Restart Quiz</button>
					<div>
						{recordedBlobs.map((blob, index) => (
							<div key={index}>
								{blob ? (
									<audio controls>
										<source src={URL.createObjectURL(blob)} type="audio/webm" />
										Your browser does not support the audio element.
									</audio>
								) : (
									<p>Question {index + 1} was skipped</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default QuizPage;
