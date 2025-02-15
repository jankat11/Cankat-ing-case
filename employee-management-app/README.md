# Employee Management Application

## Project Overview

This case project was provided to me as a sample by ING Bank and developed using LiteElement (JavaScript). In accordance with the scenario, a web interface was designed for maintaining and updating employee records. All required functionalities have been flawlessly implemented, including comprehensive testing and the complete design of all JavaScript functions.

## Design & Implementation Details

### UI/UX

- **Colors:**  
  The primary color is chosen to align with ING Bank's brand, and additional gray and text shades have been calculated to ensure a harmonious look.

- **Responsive Design:**  
  On mobile devices, the two columns containing the first and last names remain fixed with horizontal scrolling enabled. Similarly, the action buttons on the far right are fixed. Additionally, text and font sizes are slightly reduced to improve mobile readability.

- **Sizing:**  
  The design follows a system where `1rem = 16px`, and a scale based on multiples of 4 is used throughout. White spacing and overall dimensions have been carefully adjusted to adhere to this system.

### Initial Data

When the application is first launched, the main page layout—including the table and pagination sections—is populated with initial data to provide a detailed view. Conditions for empty states (or the absence of pagination) have been implemented for scenarios with no data. If needed, an empty array can be used to simulate a no-data state.

### State Management

For state management, no optional third-party library was used. Instead, a robust architecture compatible with local storage has been implemented to handle all state operations seamlessly.

### Testing

Open WC testing was used, with 27 tests written, achieving a 98% code coverage rate across the codebase.

## Important Note

On Windows (PowerShell), due to restrictions with single and double quotes, the following syntax is used in the project's `package.json`: ` "test": "web-test-runner --node-resolve --files \"test/**/*.test.js\" --coverage" ` If you experience issues with testing on terminals from other operating systems, you can change it to: 
` "test": "web-test-runner --node-resolve --files 'test/**/*.test.js' --coverage" `

---

## Usage

Ensure that you're in the root directory where `package.json` is located. After installing the necessary libraries using `npm install`, you can start the development server with `npm run dev` and run tests with `npm t`.

