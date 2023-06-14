
''' Imports Section'''
import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras.models import load_model
# import itertools
# import os
# import shutil
# import random
import cv2
import matplotlib.pyplot as plt
# %matplotlib inline


'''Loading model'''
main_model = load_model("main-model-2-classes.h5")
leaf_model = load_model("leaf-model-3-classes.h5")
trunk_model = load_model("trunk-model-3-classes.h5")


''' Address of Image relative to the current directory'''
addr = "Mix dataset/Trunk/Peepal/PEEPAL_T11214.jpg"

''' Image Preprocessing'''
image2 = cv2.imread(addr)
image_resized = cv2.resize(image2,(224,224))
image = np.expand_dims(image_resized,axis=0)
# image.shape

'''Class Declaration'''
classes_1 = ['Leaf', 'Trunk']
classes_2 = ['Karanj', 'Neem', 'Peepal']


''' First Category Prediction'''
pred = main_model.predict(image)
output = classes_1[np.argmax(pred)]
# print(output)

'''Second Category Prediction'''
if output=="Trunk":
  pred2 = trunk_model.predict(image)
  output2 = classes_2[np.argmax(pred)]
  # print(output2)

if output=="Leaf":
  pred2 = leaf_model.predict(image)
  output2 = classes_2[np.argmax(pred)]
  # print(output2)

'''Output to terminal '''
print(output2,output)

#   cv2.imshow(f"{output2} {output}",image2)

'''Displaying image and Output Predictions'''
plt.imshow(image2)
plt.title(f"{output2} {output}")
plt.show()