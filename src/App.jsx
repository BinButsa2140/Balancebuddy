import "./App.css";
import { useState } from "react";
import { performOCR } from "./utils/ocr";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bills, setBills] = useState([]);
  const [sum, setSum] = useState(0);

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setIsLoading(true);
      try {
        const ocrResult = await performOCR(file);
        setResult(ocrResult);
        const cleanedText = preprocessingText(ocrResult);
        const money = findMoney(cleanedText);
        if (money !== null) {
          setSum((prevSum) => prevSum + money); // Update the sum only when money is found
        }
        setBills([...bills, ocrResult]);
      } catch (error) {
        console.error("OCR Error:", error);
        setResult("Error processing the image.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const preprocessingText = (text) => {
    // Keep only Thai, English, numbers, and dots
    let cleanedText = text.replace(/[^ก-๙a-zA-Z0-9\s.]/g, "");
    cleanedText = cleanedText.replace(/\s+/g, " ").trim();
    return cleanedText;
  };

  const findMoney = (text) => {
    const splited = text.split(" ");
    const targets = ["จํานวนเงิน", "amount", "AMOUNT"]
    let tindex = -1
    for(const target of targets){
      tindex = splited.indexOf(target) + 1;
      if(tindex>0){
        break;
      }
    }
    if (tindex > 0 && tindex < splited.length) {
      const value = parseFloat(splited[tindex]); // Convert to number
      if (!isNaN(value)) {
        return value; // Return the numeric value
      }
    }
    return null; // Return null if no valid value found
  };

  return (
    <div className="grid grid-cols-3 gap-8 mx-5 my-10 justify-center bg-gray-50 p-8 rounded-xl shadow-lg">
  {/* File Upload Section */}
  <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-8 rounded-xl hover:border-blue-500 transition-all duration-200 bg-white">
    <input
      className="p-6 border-2 border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 w-full text-center"
      type="file"
      accept="image/*"
      onChange={handleChange}
      multiple
      placeholder="Upload here"
    />
    {image && (
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-700">Selected Image:</p>
        <img
          src={URL.createObjectURL(image)}
          alt="Selected"
          className="mt-4 rounded-lg shadow-md max-w-full h-auto"
          style={{ maxWidth: "300px" }}
        />
      </div>
    )}
  </div>

  {/* OCR Result Section */}
  <div className="text-center bg-white p-6 rounded-xl shadow-lg">
    <p className="text-3xl font-bold text-gray-800 mb-6">OCR Result:</p>
    <div className="space-y-4">
      {bills.length > 0 ? (
        bills
          .slice()
          .reverse()
          .map((data, index) => (
            <div
              key={index}
              className="p-4 text-left border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <p className="text-gray-700">Raw Text: {data}</p>
            </div>
          ))
      ) : isLoading ? (
        <p className="text-gray-600">Processing...</p>
      ) : (
        <p className="text-gray-600">No result yet</p>
      )}
    </div>
  </div>

  {/* Sum and Reset Section */}
  <div className="flex flex-col items-center  p-6 border-l-2 border-gray-200 gap-6 bg-white rounded-xl shadow-lg">
    <p className="text-3xl font-bold text-gray-800">Sum: {sum.toFixed(2)}</p>
    <button
      onClick={(e) => {
        setBills([]);
        setSum(0);
      }}
      className="uppercase px-6 py-3 text-lg font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md"
    >
      Reset
    </button>
  </div>
</div>
  );
}

export default App;
