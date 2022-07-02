from dataclasses import dataclass, field
import json

@dataclass
class cursor:
    currentTable: str        = ""
    movementLog : list[str]  = field(default_factory=list)
    changeLog   : list[str]  = field(default_factory=list)
    
    def _log(self, msg:str) -> None:
        self.changeLog.append(msg)

    def _err(self, msg:str, errno:int=-1) -> None:
        self.changeLog.append(msg)
        if errno != 0:
            raise Exception(msg)

    def setPos(self, table:str) -> None:
        ## store the previous table
        self.movementLog.append(self.currentTable)
        self.currentTable = table
        
    def back(self) -> bool:
        if len(self.movementLog) <= 0:
            self.currentTable = ''
            return False
        self.currentTable = self.movementLog.pop()
        return True

class dbHandler:
    
    def __init__(self, dbFile:str) -> None:
        self.dbFile = dbFile
        self.data:dict[str,dict]   = {}
        
        self.cursor = cursor()
        self._read()
        
    def _read(self) -> None:
        with open(self.dbFile, "r") as reader:
            self.data = json.load(reader)
        
    def _write(self) -> None:
        with open(self.dbFile, "w") as writer:
            json.dump(self.data, writer,indent=4)
    
    def _typeof(self, value:str, autoInc:bool=False) -> str:
        if not isinstance(value, str):
            try:
                value = str(value)
            except:
                return "unknown"
        if autoInc:
            return "INCREMENTED"
        elif value.isnumeric():
            return "int"
        elif value.isdecimal():
            return "float"
        else:
            return "str" 
    
    def _exists(self, name:str) -> bool:
        return name in self.data 
    
    def newTable(self, name:str, tableScheme:dict) -> None:
        """
            Create a new table of {name} with scheme {tableScheme}
            
            tableScheme = {
                "ID"  : "INCREMENTED"
                "arg1" : "str"
                "arg2" : "int"
            }
        
        """
        name = self.cursor.currentTable + "." + name if self.cursor.currentTable != '' else name
        
        if not name in self.data:
            self.data[name] = {
                "scheme" : tableScheme,
                "data"   : []
            }
            self.cursor._log(f"Created table {name} with scheme {tableScheme}")
    
    def removeTable(self) -> None:
        assert self.cursor.currentTable != '', "Error! Please select a table to delete"
        
        del self.data[self.cursor.currentTable]
        self.cursor.back()
    
    def clearTable(self) -> None:
        assert self.cursor.currentTable != "", "Error! Cannot clear from root!"
        
        self.data[self.cursor.currentTable]['data'].clear()
    
    def move(self, table:str, linear:bool=False) -> None:
        """
            move cursor to a table
            
            linear (bool) -> is the table in the same scope as our current table
                True  = check using current table +
                False = Start from root
        """
        table = table if not linear else f"{self.cursor.currentTable}.{table}"
        if table != '':
            assert self._exists(table), f"The table {table} does not exist."
        
        self.cursor.setPos(table)
        
    def back(self) -> None:
        """
            Just invokes cursor.back()
        """
        self.cursor.back()
    
    def indexOf(self, lookFor:tuple) -> int:
        tbl = self.data[self.cursor.currentTable]
        if lookFor[0] not in tbl['scheme'].keys():
            return -1
        for i, item in enumerate(tbl['data']):
            if item[lookFor[0]] == lookFor[1]:
                return i
            
        return -1
    
    def where(self, lookFor:tuple) -> dict|bool:
        ind = self.indexOf(lookFor)
        if ind == -1:
            return False
        return self.data[self.cursor.currentTable]['data'][ind]
    
    def get(self, index:int) -> dict|bool:
        if len(self.data[self.cursor.currentTable]['data']) > index:
            return self.data[self.cursor.currentTable]['data'][index]
        return False
    
    def delete(self, index:int) -> None:
        tmpDict = self.data[self.cursor.currentTable].copy()
        assert len(tmpDict['data']) > index, f"Index {index} out of range for {self.cursor.currentTable}."
        
        tmpDict['data'].pop(index)
        self.data[self.cursor.currentTable] = tmpDict.copy()
        del tmpDict
        
    def getTable(self) -> list|dict:
        if self.cursor.currentTable != '':
            return self.data[self.cursor.currentTable]
        return self.data
    
    def insert(self, data:dict) -> None:
        tmpDict = self.data[self.cursor.currentTable].copy()
        if 'ID' in tmpDict['scheme'].keys() and tmpDict['scheme']['ID'] == 'INCREMENTED':
            inc = 0
            if len(tmpDict['data']) > 0:
                inc = int(tmpDict['data'][-1]['ID'])
            data['ID'] = inc + 1
        assert self.__checkEqual(list(data.keys()), list(tmpDict['scheme'].keys())), f"The data given does not match the scheme of table '{self.cursor.currentTable}'"
        
        for key in data.keys():
            dType = self._typeof(data[key], tmpDict['scheme'][key] == 'INCREMENTED')
            assert dType == tmpDict["scheme"][key], f"For argument '{key}', we got {dType} when we expected {tmpDict['scheme'][key]}."
        
        
        tmpDict['data'].append(data)
        
        self.data[self.cursor.currentTable] = tmpDict.copy()
        del tmpDict
        
    def insertAt(self, data:dict, table:str) -> None:
        self.move(table)
        self.insert(data)
        self.back()
        
    @staticmethod
    def __checkEqual(li1:list, li2:list) -> bool:
        if len(li1) != len(li2):
            return False
        for x in li1:
            if x not in li2:
                return False
        return True