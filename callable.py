import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.applications.inception_v3 import preprocess_input
from tensorflow.keras.models import Model,Sequential
from keras.models import load_model
from tensorflow.keras.preprocessing import sequence
from PIL import Image
from tensorflow.keras.preprocessing import image
import pickle
# import flask module
import os
from flask import Flask, request, jsonify
 
# instance of flask application
app = Flask(__name__)


def load(path):
    with open(os.getcwd()+"\\"+path + '.pkl', 'rb') as f:  # 'rb' for reading; can be omitted
        my_dict = pickle.load(f)  # load file content as my_dict
    return my_dict

# model = InceptionV3(weights='imagenet')
# model_new = Model(model.input, model.layers[-2].output)

model_new = load_model("encoding_model.h5")

def preprocess(image_path):
  img = image.load_img(image_path, target_size=(299, 299))
  x = image.img_to_array(img)
  x = np.expand_dims(x, axis=0)
  x = preprocess_input(x)
  return x

def encode(image):
  image = preprocess(image)
  fea_vec = model_new.predict(image)
  fea_vec = np.reshape(fea_vec, fea_vec.shape[1])
  return fea_vec

wordtoix = load("wordtoix")
ixtoword = load("ixtoword")


trunk_model = load_model("best.h5")

# init(autoreset=True)
# home route that returns below text
# when root url is accessed
# @app.route("/full-analysis")
# def func1():
#     images = encode("/content/drive/MyDrive/data/Roshni Mam/1001773457_577c3a7d70.jpg")


@app.route("/im_size", methods=["POST"])
def process_image():
    # print(request.files)
    file = request.files['file']
    # Read the image via file.stream
    img = Image.open(file.stream)
    # print(dir(img))
    img.save(f'{file.filename}')
    # print([img.width, img.height])
    images = encode(f'{file.filename}')
    image2 = images.reshape((1, 2048))
    start = [wordtoix["startseq"]]
    start_word = [[start, 0.0]]
    while len(start_word[0][0]) < 38:
        temp = []
        for s in start_word:
            par_caps = sequence.pad_sequences([s[0]], maxlen=38, padding='post')
            preds = trunk_model.predict([image2, par_caps], verbose=0)
            word_preds = np.argsort(preds[0])[-5:]
            # Getting the top <beam_index>(n) predictions and creating a
            # new list so as to put them via the model again
            for w in word_preds:
                next_cap, prob = s[0][:], s[1]
                next_cap.append(w)
                prob += preds[0][w]
                temp.append([next_cap, prob])

        start_word = temp
        # Sorting according to the probabilities
        start_word = sorted(start_word, reverse=False, key=lambda l: l[1])
        # Getting the top words
        start_word = start_word[-5:]
    start_word = start_word[-1][0]
    start_word = list(filter(lambda u: u > 0, start_word))
    intermediate_caption = [ixtoword[i] for i in start_word]

    final_caption = []

    for i in intermediate_caption:
        if i != 'endseq':
            final_caption.append(i)
        else:
            break

    final_caption = ' '.join(final_caption[1:])
    print(final_caption)
    return jsonify({'caption': final_caption,'msg': 'success'})
 
if __name__ == '__main__':
    app.run(debug=True, port=8001)
