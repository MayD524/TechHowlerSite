import os

pth = path.replace("*","")
fname = inputData.replace(pth, "")

pth += fname

ext = fname.split('.')[1]

dType = f"image/{ext}"

with open("../../" + pth, "rb") as reader:
    OutData = reader.read()
    Result  = 200


## we don't need these to stay in local scope
del pth
del fname
del ext