"""
    Whats in the dev panel?
        db management
        route creation/deletion
        uploading new routes
        pushing updates/notifications
"""

initPath = "/api/dev/"
truePath = path.replace(initPath, "")


if method == "GET":
    match truePath:
        case "isauth":
            with open("../data/dev_pannel.html", 'r') as reader:
                OutData = reader.read()
                Result = 200
    
    
elif method == "POST":
    pass
