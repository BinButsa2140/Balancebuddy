import Tesseract from "tesseract.js";

export const performOCR = (file) => {
    return new Promise((resolve, reject)=>{//กำหนด หากสำเร็จ กับหากมีปัญหา
        Tesseract.recognize(
            file, 
            'tha+eng', //ภาษา
            {
              logger: (info) => console.log(info), 
              tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789กขฃคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาิีึืุูเแโใไ์ํ็ๆฯฺ', // Whitelist characters
            }
          )
            .then(({ data: { text } }) => {
              resolve(text)
            })
            .catch((error) => {
              console.error('Error during OCR:', error);
              reject(error)
            });
    })
  };