import { render, screen, fireEvent } from "@testing-library/react";
import App from "../components/App";
import hogs from "../porkers_data";
import { useState } from "react";
import hogData from "./porkers_data";
import Nav from "./Nav";
import HogList from "./HogList";

describe("Hog App", () => {
  it("displays a tile for each hog on load", () => {
    render(<App />);
    hogs.forEach((hog) => {
      expect(screen.getByText(hog.name)).toBeInTheDocument();
      const img = screen.getByAltText("Photo of " + hog.name);
      expect(img).toHaveAttribute("src", hog.image);
    });
  });

  it("displays additional hog details when a tile is clicked", () => {
    render(<App />);
    const index = Math.floor(Math.random() * 11)
    const hogTile = screen.getByText(hogs[index].name);
    hogTile.parentElement.parentElement
    fireEvent.click(hogTile);

    expect(screen.getByText(`Specialty: ${hogs[index].specialty}`)).toBeInTheDocument();
    expect(screen.getByText(hogs[index].weight)).toBeInTheDocument();
    expect(screen.getByText(hogs[index].greased ? "Greased" : "Nongreased")).toBeInTheDocument();
    expect(screen.getByText(hogs[index]["highest medal achieved"])).toBeInTheDocument();
  });

  it("filters hogs by greased status", () => {
    render(<App />);
    const filterCheckbox = screen.getByLabelText("Greased Pigs Only?");
    fireEvent.click(filterCheckbox);

    hogs.filter((hog) => hog.greased).forEach((hog) => {
      expect(screen.getByText(hog.name)).toBeInTheDocument();
    });

    hogs.filter((hog) => !hog.greased).forEach((hog) => {
      expect(screen.queryByText(hog.name)).not.toBeInTheDocument();
    });
  });

  it("sorts hogs by name or weight", () => {
    render(<App />);

    const sortBySelect = screen.getByLabelText("Sort by:");
    
    fireEvent.change(sortBySelect, { target: { value: "name" } });

    const sortedByName = [...hogs].sort((a, b) => a.name.localeCompare(b.name));
    const renderedHogNamesByName = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);

    expect(renderedHogNamesByName).toEqual(sortedByName.map((hog) => hog.name));

    fireEvent.change(sortBySelect, { target: { value: "weight" } });

    const sortedByWeight = [...hogs].sort((a, b) => a.weight - b.weight);
    const renderedHogNamesByWeight = screen.getAllByRole("heading", { level: 3 }).map((el) => el.textContent);

    expect(renderedHogNamesByWeight).toEqual(sortedByWeight.map((hog) => hog.name));
  });

  it("hides a hog when the hide button is clicked", () => {
    render(<App />);
    const sortBySelect = screen.getByLabelText("Sort by:");
    fireEvent.change(sortBySelect, { target: { value: "name" } });

    const hideButtons = screen.getAllByRole("button", {name: 'Hide Me'});
    fireEvent.click(hideButtons[0]);

    const sortedHogsByName = [...hogs].sort((a, b) => a.name.localeCompare(b.name));

    expect(screen.queryByText(sortedHogsByName[0].name)).not.toBeInTheDocument();
  });

  it("adds a new hog via the form", () => {
    render(<App />);
    const nameInput = screen.getByLabelText("Name:");
    const weightInput = screen.getByLabelText("Weight:");
    const specialtyInput = screen.getByLabelText("Specialty:");
    const greasedCheckbox = screen.getByLabelText("Greased?");
    const addButton = screen.getByText("Add Hog");

    fireEvent.change(nameInput, { target: { value: "New Hog" } });
    fireEvent.change(weightInput, { target: { value: 100 } });
    fireEvent.change(specialtyInput, { target: { value: "Dancing" } });
    fireEvent.click(greasedCheckbox);
    fireEvent.click(addButton);

    expect(screen.getByText("New Hog")).toBeInTheDocument();
  });

  it("renders hog tiles using Semantic Cards", () => {
    render(<App />);
    const cards = screen.getAllByLabelText(/hog card/i)
    
    cards.forEach((card) => {
        expect(card).toHaveClass("ui");
        expect(card).toHaveClass("card");
    });

    expect(cards.length).toBe(hogs.length);
  });
});
// jsx

function App() {
	const [hogs, setHogs] = useState(hogData);

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

