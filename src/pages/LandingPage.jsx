// src/components/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		phone: "",
		fullName: "",
		linkedin: "",
		resume: null,
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "resume") {
			setFormData({ ...formData, resume: files[0] });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here, you can handle the form submission (e.g., send data to the server)
		navigate("/quiz");
	};

	return (
		<div>
			<h1>Enter Your Details</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					name="email"
					placeholder="Email"
					onChange={handleChange}
					required
				/>
				<input
					type="tel"
					name="phone"
					placeholder="Phone"
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="fullName"
					placeholder="Full Name"
					onChange={handleChange}
					required
				/>
				<input
					type="url"
					name="linkedin"
					placeholder="LinkedIn Profile"
					onChange={handleChange}
					required
				/>
				<input
					type="file"
					name="resume"
					accept="application/pdf"
					onChange={handleChange}
					required
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default LandingPage;
