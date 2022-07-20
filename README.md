# TechHowlerSite

This is the source code for Excel Academy's news paper club, made with the help of Tech Team & github contributors!


### How to build?

#### 0. Pre-reqs

- Have [node.js](https://nodejs.org/en/) >= v.16.14.2 installed
- Have a [Python](https://www.python.org/) version >= 3.10 installed 
- Have PIP (package manager for python) and NPM (package manager for node.js) installed
- Install [git for windows](https://git-scm.com/download/win) (or mac/linux if on those devices)

### Build & run

#### 1. Setup
- open a terminal and run ```git clone https://github.com/MayD524/TechHowlerSite```
- run ```cd /TechHowlerSite```

#### 2. Build front end
- run ```npm i``` this will install all dependencies
- run ```tsc``` this will compile all the typescript code found in ```/src``` the compiled javascript will be in ```/dist``` you may see two errors and that is fine
    * any errors saying "TS6082 Only 'amd' and 'system' modules are supported..." ignore those.

#### 3. Run the server
- run ```cd /server/src```
- run ```python3 main.py``` and then the server should be running