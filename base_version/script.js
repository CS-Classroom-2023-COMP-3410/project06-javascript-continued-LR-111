document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("periodic-table");
  
    // Create grid items for each element
    elements.forEach((element) => {
      const div = document.createElement("div");
      div.classList.add("element");
      div.innerText = element.symbol;
      // Store data attributes
      div.dataset.number = element.number;
      div.dataset.group = element.group;
      // On click => show details
      div.onclick = () => showDetails(element);
      table.appendChild(div);
    });
  });
  
  function showDetails(element) {
    const details = document.getElementById("element-details");
    details.classList.remove("hidden");
    details.innerHTML = `
      <h2>${element.name} (${element.symbol})</h2>
      <p>Atomic Number: ${element.number}</p>
      <p>Group: ${element.group}</p>
    `;
  
    // Remove previous highlights
    document.querySelectorAll(".element").forEach((el) => el.classList.remove("highlight"));
  
    // Highlight selected element and its group
    document.querySelectorAll(`[data-group="${element.group}"]`)
      .forEach((el) => el.classList.add("highlight"));
  }
  
  // REVISED SEARCH FUNCTION
  function searchElement() {
    const input = document.getElementById("search").value.trim().toLowerCase();
    const isNumeric = /^\d+$/.test(input); // check if input is numeric
  
    let matchedElements = [];
  
    // If user clears input, show all
    if (!input) {
      matchedElements = elements.map((e) => e.number); // all elements
    } 
    // If input is numeric, do partial match on atomic number
    else if (isNumeric) {
      matchedElements = elements
        .filter((e) => e.number.toString().includes(input))
        .map((e) => e.number);
    } 
    // Otherwise, check for an exact symbol match first
    else {
      // Try to find exact symbol match
      const symbolElement = elements.find((e) => e.symbol.toLowerCase() === input);
      if (symbolElement) {
        // If a symbol matches exactly, only show that one
        matchedElements = [symbolElement.number];
      } else {
        // Otherwise, do partial match on element name
        matchedElements = elements
          .filter((e) => e.name.toLowerCase().includes(input))
          .map((e) => e.number);
      }
    }
  
    // Update the display for each element
    document.querySelectorAll(".element").forEach((el) => {
      const number = parseInt(el.dataset.number, 10);
      if (matchedElements.includes(number)) {
        el.style.display = "flex";
      } else {
        el.style.display = "none";
      }
    });
  }
  