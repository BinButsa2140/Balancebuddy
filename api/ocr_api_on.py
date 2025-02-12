from flask import blueprints,request,jsonify
import cv2
import easyocr
import numpy as np

ocr = blueprints('ocr',__name__)

@ocr.route('/ocr', methods=['POST'])
def getOCRText():
    if 'img' not in request.files:
        return jsonify({'error: No image'}),400
    
    upim = request.files['img']    
    
    #img
    npimg = np.frombuffer(upim.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    
    
    reader = easyocr.Reader(['th','en'])
    result = reader.readtext(img,detail=0)
    
    return jsonify({'text' : result})
        