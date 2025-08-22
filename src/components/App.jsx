import { useState } from "react";
import hogData from "./porkers_data";
import Nav from "./Nav";
import HogList from "./HogList";

function App() {
	// main hog list state
	const [hogs, setHogs] = useState(hogData);

	// ✅ this is where your code goes
	const [newHog, setNewHog] = useState({
		name: "",
		specialty: "",
		greased: false,
		weight: "",
		highestMedalAchieved: "",
		image: ""
	});

	function handleChange(e) {
		const { name, value, type, checked } = e.target;
		setNewHog({ ...newHog, [name]: type === "checkbox" ? checked : value });
	}

	function handleSubmit(e) {
		e.preventDefault();
		setHogs([...hogs, { ...newHog, weight: Number(newHog.weight) }]);
		// reset form
		setNewHog({
			name: "",
			specialty: "",
			greased: false,
			weight: "",
			highestMedalAchieved: "",
			image: ""
		});
	}

	return (
		<div className="ui container">
			<Nav />

			{/* ✅ Form for adding hogs */}
			<form className="ui form" onSubmit={handleSubmit}>
				<h4>Add a New Hog</h4>

				<label htmlFor="hog-name">Name:</label>
				<input
					id="hog-name"
					name="name"
					value={newHog.name}
					onChange={handleChange}
				/>

				<label htmlFor="hog-specialty">Specialty:</label>
				<input
					id="hog-specialty"
					name="specialty"
					value={newHog.specialty}
					onChange={handleChange}
				/>

				<label htmlFor="hog-greased">Greased?</label>
				<input
					id="hog-greased"
					type="checkbox"
					name="greased"
					checked={newHog.greased}
					onChange={handleChange}
				/>

				<label htmlFor="hog-weight">Weight:</label>
				<input
					id="hog-weight"
					type="number"
					name="weight"
					value={newHog.weight}
					onChange={handleChange}
				/>

				<label htmlFor="hog-medal">Medal:</label>
				<input
					id="hog-medal"
					name="highestMedalAchieved"
					value={newHog.highestMedalAchieved}
					onChange={handleChange}
				/>

				<label htmlFor="hog-image">Image:</label>
				<input
					id="hog-image"
					name="image"
					value={newHog.image}
					onChange={handleChange}
				/>

				<button type="submit">Add Hog</button>
			</form>

			<HogList hogs={hogs} />
		</div>
	);
}

export default App;