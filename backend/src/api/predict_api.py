from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np

app = Flask(__name__)
model = load_model("plant_model.h5")  # Load trained model

def predict(image_path):
    img = load_img(image_path, target_size=(128, 128))
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)[0]
    class_idx = np.argmax(prediction)

    if class_idx == 0:
        return {
            "health": "Healthy",
            "suggestion": "Continue regular care."
        }
    else:
        return {
            "health": "Diseased",
            "suggestion": "Reduce watering. Apply antifungal spray."
        }

@app.route("/predict", methods=["POST"])
def predict_route():
    file = request.files['image']
    filepath = f"./temp/{file.filename}"
    file.save(filepath)

    result = predict(filepath)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5001)
