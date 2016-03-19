import sqlite3, urllib, time
from BeautifulSoup import *
conn = sqlite3.connect('networkAssignment.sqlite')
cur = conn.cursor()
assignmentNO = 8
# Table Create Query
#CREATE TABLE answer (
#    id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
#    name TEXT,
#    question_id INTEGER
#)
#CREATE TABLE assignment (
#    id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
#    name INTEGER UNIQUE
#)
#CREATE TABLE "question" (
#	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
#	`name`	TEXT,
#	`assignment_id`	INTEGER,
#	`answerid`	INTEGER,
#	`needReview`	INTEGER
#)
while True:
    time.sleep(1)
    url = 'http://64.107.76.234/Submitcis370Quiz0'+ str(assignmentNO) + '.aspx'
    html = urllib.urlopen(url).read()
    soup = BeautifulSoup(html)
    tags = soup('span')
    num = -1
    question = None
    cur.execute('''INSERT OR IGNORE INTO assignment (name) 
    VALUES ( ? )''', ( assignmentNO, ) )
    cur.execute('SELECT id FROM assignment WHERE name = ? ', (assignmentNO, ))
    assignment_id = cur.fetchone()[0]
    for tag in tags:
        if tag.get("id", None) == 'lblTotalQuestion':
            num = int(tag.contents[0].strip())
            print num
        elif tag.get("id", None) == 'lblQuestion':
            question = tag.contents[0].strip()[3:]
    cur.execute('SELECT count(id) FROM question WHERE assignment_id = ?', (assignment_id, ))    
    row = cur.fetchone()[0]
    print row
    if int(row) < num * 0.95:
        cur.execute('SELECT count(id) FROM question WHERE name = ?', (question, ))    
        row = cur.fetchone()[0]
        if int(row) == 0:
            print 'Not exist'
            cur.execute('''INSERT INTO question (name, assignment_id) 
            VALUES ( ?, ? )''', ( question, assignment_id ) )
            cur.execute('SELECT id FROM question WHERE name = ?', (question, ))  
            question_id = row = cur.fetchone()[0]
            tags = soup('label')
            for tag in tags:
                if tag.get('for', None) == None: continue;
                answer = tag.contents[0]
                cur.execute('''INSERT INTO answer (name, question_id) 
                VALUES ( ?, ? )''', ( answer, question_id ) )
    else: break
conn.commit()

