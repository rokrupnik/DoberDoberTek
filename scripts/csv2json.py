# -*- coding: utf-8 -*-
import json
import csv
import io

dishIngredients = []
with open('jedi - List1.tsv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter='\t', quotechar='"')
    spamreader.next()
    spamreader.next()
    for row in spamreader:
        ingredient = {
            'visible': True,
            'dish': row[0],
            'title': row[1],
            'unit': row[2],
            'vv': {
                'malo': row[3],
                'srednje': row[4],
                'zelo': row[5],
            },
            'iv': {
                'malo': row[6],
                'srednje': row[7],
                'zelo': row[8],
            },
            'pp': {
                'malo': row[9],
                'srednje': row[10],
                'zelo': row[11],
            },
        }
        dishIngredients.append(ingredient)


with io.open('jedi.json', 'w', encoding='utf8') as f:
    data = json.dumps(dishIngredients, ensure_ascii=False, encoding='utf8')
    f.write(unicode(data))

ingredients = []
with open('živila - List1.tsv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter='\t', quotechar='"')
    spamreader.next()
    spamreader.next()
    for row in spamreader:
        ingredient = {
            'visible': True,
            'title': row[1],
            'unit': row[2],
            'vv': {
                'malo': row[3],
                'srednje': row[4],
                'zelo': row[5],
            },
            'iv': {
                'malo': row[6],
                'srednje': row[7],
                'zelo': row[8],
            },
            'pp': {
                'malo': row[9],
                'srednje': row[10],
                'zelo': row[11],
            },
        }
        ingredients.append(ingredient)


with io.open('zivila.json', 'w', encoding='utf8') as f:
    data = json.dumps(ingredients, ensure_ascii=False, encoding='utf8')
    f.write(unicode(data))