# Failed Feature: Voice Search for Interactive Periodic Table

## **Description**
I attempted to add a **Voice Search** feature to my **Interactive Periodic Table** using the **Web Speech API**. The goal was to allow users to click a **microphone button**, speak an element's name, and have the system **automatically search and highlight** that element.

## **Why This is a Reasonable Feature**
1. **Web Speech API is a standard browser feature**  
   - Browsers like **Google Chrome** support **speech recognition** natively.
   - Many web applications (e.g., Google Search, Dictation tools) already use **voice input**.

2. **It enhances accessibility**  
   - Users with **limited typing ability** can **speak** instead of using the keyboard.
   - It would make the **Periodic Table more interactive** and easier to use.

3. **The functionality is well-defined**  
   - Users click the **🎤 Voice Search button**.
   - The browser listens and **recognizes spoken input**.
   - If a valid element is detected, it is **highlighted** and its **details are shown**.

## **How It Was Supposed to Work**
1. **User clicks on the 🎤 Voice Search button**.
2. **Microphone activates**, and the browser listens for speech.
3. **User speaks an element's name** (e.g., "Oxygen").
4. **The recognized text appears in the search box**.
5. **The system searches for the element**:
   - If found, it is **highlighted** in the periodic table.
   - If not found, an error message is displayed.

## **How ChatGPT Failed to Implement It**
Despite multiple attempts and improvements, the feature **never worked correctly**.  

### **Attempt 1: No Search Triggered**
- ChatGPT provided JavaScript using the **Web Speech API**.
- After clicking the **🎤 Voice Search button**, the microphone activated.
- **Issue:** The recognized speech **did not trigger a search**, and the element was **never highlighted**.

### **Attempt 2: No Recognized Speech Output**
- Debugging was added (`console.log(transcript)`) to check **recognized speech**.
- **Issue:** The browser **did not print any recognized speech** in the console.
- The `onresult` function **never triggered**, meaning **no words were captured**.

### **Attempt 3: Microphone Permissions & Fuzzy Matching**
- **Checked microphone permissions** (browser settings).
- Added **fuzzy string matching** (Levenshtein distance) to recognize **mispronounced words**.
- **Issue:** The system still **failed to recognize spoken element names**.
- Even after manually testing `SpeechRecognition`, **no valid output was received**.

## **Conclusion**
After **three failed attempts**, the Voice Search feature could not be successfully implemented using ChatGPT.  
Possible reasons:
1. **Web Speech API limitations** in handling specific words (e.g., chemical names).
2. **Inconsistent microphone behavior** across browsers.
3. **JavaScript execution timing issues** preventing proper speech recognition.

Since the feature is **not working despite multiple refinements**, it is considered a **failed feature** in this project.
