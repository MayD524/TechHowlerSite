

pth = "../../" + givenPath

if pth == "../..//style/bootstrap.min.css.map":
    pth = "../../style/bootstrap.css"

with open(pth, 'r') as reader:
    OutData = reader.read()
    dType = "text/css"
    Result = 200
    