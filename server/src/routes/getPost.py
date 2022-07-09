import json

initRoute = "/api/getPost/"
req = givenPath.replace(initRoute, '')

reqMin, reqMax = req.split("&")

try:
    reqMin, reqMax = int(reqMin), int(reqMax)
    dbhandler.move("post")
    dbt = dbhandler.getTable()
    dt = []
    
    for lb in dbt['data']:
        if lb['ID'] <= reqMax and lb['ID'] > reqMin:
            dt.append(lb)
        elif lb['ID'] > reqMax:
            break
        
    
    Result = 200
    OutData = json.dumps(dt)
    
except TypeError:
    Result = 500
    OutData = "Could not get posts in range (%s,%s) because one value is not an integer." %(reqMin, reqMax)
dbhandler.back()