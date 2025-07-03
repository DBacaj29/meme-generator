// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Define the Core functional component that displays and manages memes
const Core = () => {
  // useState hook to hold the current meme data:
  // - topText and bottomText store the overlay texts for the meme
  // - imageURL holds the URL of the currently displayed meme image
  // Initialize with empty texts and a default meme image URL
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    imageURL: "https://i.imgflip.com/1bij.jpg"
  });

  // useState hook to store the full list of meme templates fetched from the API
  // Initially an empty array until memes are loaded
  const [allMemes, setAllMemes] = useState([]);

  // Handler function to update the meme texts as the user types
  // event.currentTarget contains the input element triggering the change
  // Destructure `name` (input's name attribute) and `value` (current input value)
  function handleChange(event) {
    const { value, name } = event.currentTarget;

    // Update the meme state by copying the previous meme object,
    // and overwriting the specific property that changed (topText or bottomText)
    setMeme(prevMeme => ({
      ...prevMeme,   // Spread operator copies existing meme properties
      [name]: value  // Dynamically update the property matching the input's name attribute
    }));
  }

  // useEffect hook to perform a side effect after component mounts:
  // Fetch meme templates from the Imgflip API once when the component loads
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")  // Make HTTP GET request
      .then(res => res.json())                   // Parse JSON response
      .then(data => setAllMemes(data.data.memes)) // Update allMemes state with the array of memes
  }, []); // Empty dependency array means this runs only once on mount

  // Function to select a random meme image from the fetched list
  function getMemeImage() {
    // Generate a random index based on allMemes array length
    const randomNumber = Math.floor(Math.random() * allMemes.length);

    // Get the URL of the randomly selected meme template
    const newMemeUrl = allMemes[randomNumber].url;

    // Update the meme's imageURL property while preserving existing text values
    setMeme(prevMeme => ({
      ...prevMeme,
      imageURL: newMemeUrl
    }));
  }

  // Return JSX defining the component’s UI:
  // - A form with inputs for top and bottom meme text, linked to state via value and onChange
  // - A button that triggers a new random meme image
  // - A display area showing the current meme image and overlayed texts
  return (
    <main>
      <div className="form" action="submit">
        {/* Label and input for top text */}
        <label>
          Top Text
          <input
            type="text"
            name="topText"          // Links to the meme.topText state property
            onChange={handleChange} // Updates meme state on user input
            value={meme.topText}    // Controlled input: reflects current state
          />
        </label>

        {/* Label and input for bottom text */}
        <label>
          Bottom Text
          <input
            type="text"
            name="bottomText"       // Links to the meme.bottomText state property
            onChange={handleChange} // Updates meme state on user input
            value={meme.bottomText} // Controlled input: reflects current state
          />
        </label>

        {/* Button to get a new random meme image */}
        <button onClick={getMemeImage}>Get a new meme image 🖼️</button>
      </div>

      {/* Meme display section */}
      <div className="meme">
        {/* Display the currently selected meme image */}
        <img src={meme.imageURL} alt="Meme" />

        {/* Overlay the top text on the image */}
        <span className="top">{meme.topText}</span>

        {/* Overlay the bottom text on the image */}
        <span className="bottom">{meme.bottomText}</span>
      </div>
    </main>
  );
};

// Export the Core component as default so it can be imported elsewhere
export default Core;
