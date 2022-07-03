with open("../../dist/" + inputData.replace("/dist/", ""), 'r') as reader:
    OutData = reader.read()
    Result = 200
    dType = 'text/javascript'