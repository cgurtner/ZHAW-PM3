import re

# Those are helper functions for the importer

def cast(name, type, entry):
    if type == 'int':
        entry[name] = int(entry[name])
    elif type == 'float':
        entry[name] = float(entry[name])
    return entry        

def delField(name, entry):
    if name in entry:
        del entry[name]
    return entry

def compare(id, original, cleaned):
    for entry in original:
        if entry['id'] == str(id):
            print(entry)
    for entry in cleaned:
        if entry['id'] == id:
            print(entry)

def addHttp(url):
    if url and not re.match(r'^(?:http|https)://', url):
        return 'http://' + url
    return url